Stratosphere AI — Security Architecture Note
Owner: Aditya (Backend & AI Systems Architect) · Status: Design (MVP uses simulated cloud data; this note describes the
production path that the simulated layer is a stand-in for).
Last updated: Day 8, Galuxium Nexus V2 build window.

Scope note for judges. The shipped MVP connects to a mock cloud data
generator that produces realistic AWS-style EC2/RDS/EBS/ELB/S3
(see Day 2). No real AWS account is ever touched and no real customer
credentials are stored. This document describes the production-grade
credential and access model that the simulated layer is a stand-in for.
The design is included here because the Enterprise Governance &
Compliance criterion explicitly rewards a defensible security
architecture, and the cheapest moment to define one is before the
first real credential ever lands in the system.

1. Threat model in one paragraph
A customer connects their AWS account to Stratosphere. From that
moment on, we hold a credential that lets our service read the state
of their infrastructure. The single highest-severity risk in the
entire product is that credential being exfiltrated or misused —
either at rest (database leak, snapshot escape, log dump), in transit
(mitm, misconfigured TLS), or at the permission boundary (the
credential doing more than read-only inventory). Every choice below is
made to neutralize one of those three vectors.

2. What we never do
We never store the customer's root account access key.
We never store long-lived IAM user keys for the customer's account.
We never request *:* permissions. The set of actions we ask for is
enumerated, reviewable, and revocable by the customer at any time.
We never log, trace, or persist the credential itself — only a
non-reversible reference to it.

3. Credential form: cross-account IAM role, not access keys
In production we would use AWS IAM cross-account AssumeRole, the same
pattern AWS Audit Manager, Datadog, and CloudHealth use:

The customer creates an IAM role in their account — call it
StratosphereReadOnly — with a trust policy that permits only
Stratosphere's own AWS account (a single fixed
arn:aws:iam::<our-acct>:root principal) to assume it, optionally with
an ExternalId condition that we generate per-customer to prevent the
"confused deputy" attack.
The customer hands us the role ARN only — never a key. There is no
secret on the customer side to leak.
At scan time, Stratosphere's worker calls sts:AssumeRole with the role
ARN, receives short-lived credentials (15–60 min TTL), runs the
read-only inventory, and lets the credentials expire.
This means the "credential stored at rest" is just a string of the
form arn:aws:iam::123456789012:role/StratosphereReadOnly plus the
per-customer ExternalId. Neither is a usable secret on its own —
assuming the role still requires our own internal AWS principal, which
is itself gated by IAM and SCPs.

4. Encryption at rest
The role ARN is not directly assumable by an attacker, but we still
treat it as sensitive PII (it discloses the customer's account ID and
naming), and we encrypt at rest with envelope encryption:

KMS customer master key (CMK), one per region, rotated automatically by
AWS KMS on an annual schedule (EnableKeyRotation: true). The CMK never
leaves KMS unencrypted and is never directly used to encrypt data.
Data keys are generated per row (per connected cloud account) by KMS
GenerateDataKey. The plaintext data key encrypts the role ARN and
ExternalId with AES-256-GCM in the application layer; the ciphertext
blob of the data key is stored alongside the row.
Database column-level encryption is applied to the role_arn and
external_id columns in cloud_accounts before the row hits Postgres, so
a raw pg_dump, an RDS snapshot escape, or a read-replica in a
less-trusted account would yield only ciphertext.
Supabase RLS (already implemented in Day 2 and hardened in Day 10) is
the second layer: even with a valid DB session, only members of the
owning organization can see the row at all.
The combination is what defends against the realistic threat (scenario:
an attacker obtains a database connection string or an RDS snapshot)
rather than the movie-plot threat (scenario: an attacker has KMS
administrator rights, in which case the system is already fully lost).

5. Least-privilege read-only IAM policy
The StratosphereReadOnly role's attached policy grants only the
Describe / List / Get actions the rules engine actually needs — no
Write, no Delete, no Modify, no IAM actions. The full action set,
mapped to the rules that consume them:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Ec2Inventory",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeVolumes",
        "ec2:DescribeSnapshots",
        "ec2:DescribeLoadBalancers",
        "ec2:DescribeAddresses",
        "ec2:DescribeInstanceTypes",
        "ec2:DescribeTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "RdsInventory",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:DescribeDBSnapshots"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3Inventory",
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation",
        "s3:GetBucketTagging",
        "s3:GetLifecycleConfiguration",
        "s3:GetBucketVersioning",
        "s3:ListBucket"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CostInventory",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetRightsizingRecommendation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchMetrics",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    }
  ]
}

Notes worth surfacing to judges:

The "Apply Fix" loop (the AI-generated IaC/CLI snippet that the
engineer approves in the UI) is, by design, not executed by this role.
The MVP simulates the apply step by mutating mock state; in production,
the approved fix would be returned to the customer as a pull request on
their infrastructure-as-code repo, executed by their CI/CD under their
privileged role. Stratosphere's read role never has write access to
the customer account. This separation is the single most important
governance property of the product.
Resource: "*" is unavoidable for the Describe family — these actions
are not resource-scopable in IAM — but it is bounded by the action
allowlist above, which is what makes it least-privilege in practice.

6. Rotation policy
Three overlapping rotation clocks:
| Asset | Rotation cadence | Mechanism |
|---|---|---|
| KMS CMK (per region) | 365 days automatic | AWS-managed `EnableKeyRotation` |
| Per-row data keys | Implicit — a new data key is generated whenever the role ARN or external_id changes | Application-layer `GenerateDataKey` call |
| `ExternalId` per customer | On customer request, or annually, or immediately after any customer-side incident | Admin endpoint rotates external_id and re-encrypts the row |
| Stratosphere's own IAM role used to AssumeRole | 90-day max session, automatic SCP enforcement | AWS IAM + Organizations SCP |
| Mock credentials in the MVP | N/A — none exist | — |

If the customer revokes trust (deletes the StratosphereReadOnly
role, removes us from the trust policy, or rotates the ExternalId),
Stratosphere detects the failed sts:AssumeRole on the next scan, marks
the cloud account disconnected, and surfaces a re-connect prompt to
the customer. No silent degradation.

7. Auditability
Every successful or failed AssumeRole call is written to the existing
audit log (built Day 10) with who (Stratosphere service principal),
what (sts:AssumeRole for role_arn X on behalf of org Y), and when.
The customer can see this trail in their Activity Log page; we can
replay it for them on request. This is the same audit-logging pipeline
that captures the human-in-the-loop approve/reject/apply actions inside
the product — credentials are not a separate class of event.

8. What the MVP ships instead (and why that's safe)
| Production element | MVP stand-in | Risk in MVP |
|---|---|---|
| Cross-account AssumeRole | Mock cloud data generator (Day 2) produces realistic EC2/RDS/EBS/ELB/S3 records with a configurable waste ratio | None — no real AWS account is ever contacted |
| KMS envelope encryption | n/a — no credential to encrypt | None |
| Least-privilege IAM policy | Documented above only; not provisioned | None — no real AWS API is ever called |
| Rotation | n/a | None |

The MVP is therefore a correct simulation of the production access
model, not a weaker version of it. The simulation boundary is the
/api/cloud-accounts/seed endpoint Mohar built on Day 3: replace its
body with a real AssumeRole + inventory call and the rest of the
system — rules engine, AI fix engine, approval workflow, billing —
runs unchanged. That seam is the entire reason a believable demo is
possible without a real AWS sandbox.

9. Open items for a post-MVP production build
Region failover for KMS (today: single-region CMK).
Customer-managed KMS keys for the most security-conscious
Enterprise tier (BYOK).
AWS PrivateLink / VPC endpoint for the sts:AssumeRole call so
customer role assumption never traverses the public internet from
our VPC.
Periodic automated IAM access-analyzer findings on the
StratosphereReadOnly role to catch policy drift on the customer
side.
Prepared as part of the Galuxium Nexus V2 submission. Maps to the
Enterprise Governance & Compliance (20%) and Technical Architecture
(20%) judging criteria.