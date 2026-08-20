// lib/rules-engine.ts

// 1. Define our TypeScript Interfaces
export interface CloudResource {
    id: string;
    resource_type: 'EC2' | 'RDS' | 'EBS' | 'ELB' | 'S3' | 'Snapshot';
    resource_identifier: string;
    config: any;
    utilization_metrics: any;
    simulated_monthly_cost: number;
}

export interface Finding {
    resource_id: string;
    rule_type: string;
    severity: 'low' | 'medium' | 'high';
    estimated_monthly_waste: number;
    details: string;
}

// 2. Individual Rule Functions (Pure & Independently Testable)

// Rule 1: Idle EC2 Instance
export function checkIdleEC2(resource: CloudResource): Finding | null {
    if (resource.resource_type !== 'EC2') return null;
    
    const cpuUtilization = resource.utilization_metrics?.cpu_percentage || 0;
    const state = resource.config?.state || 'running';

    if (state === 'running' && cpuUtilization < 5) {
        return {
            resource_id: resource.id,
            rule_type: 'idle_instance',
            severity: 'high',
            estimated_monthly_waste: resource.simulated_monthly_cost,
            details: `EC2 instance ${resource.resource_identifier} is running but CPU utilization is only ${cpuUtilization}%.`
        };
    }
    return null;
}

// Rule 2: Oversized EC2 Instance
export function checkOversizedEC2(resource: CloudResource): Finding | null {
    if (resource.resource_type !== 'EC2') return null;

    const cpuUtilization = resource.utilization_metrics?.cpu_percentage || 0;
    const instanceType = resource.config?.instance_type || 'unknown';

    if (cpuUtilization > 5 && cpuUtilization < 30) {
        return {
            resource_id: resource.id,
            rule_type: 'oversized_instance',
            severity: 'medium',
            estimated_monthly_waste: resource.simulated_monthly_cost * 0.5,
            details: `EC2 instance ${resource.resource_identifier} (${instanceType}) has low CPU utilization (${cpuUtilization}%). Recommend right-sizing.`
        };
    }
    return null;
}

// Rule 3: Unattached EBS Volume
export function checkUnattachedEBS(resource: CloudResource): Finding | null {
    if (resource.resource_type !== 'EBS') return null;

    const attachmentState = resource.config?.state || 'attached';

    if (attachmentState === 'available' || attachmentState === 'unattached') {
        return {
            resource_id: resource.id,
            rule_type: 'unattached_volume',
            severity: 'medium',
            estimated_monthly_waste: resource.simulated_monthly_cost,
            details: `EBS Volume ${resource.resource_identifier} is unattached and accruing costs.`
        };
    }
    return null;
}

// Rule 4: Idle Load Balancer
export function checkIdleELB(resource: CloudResource): Finding | null {
    if (resource.resource_type !== 'ELB') return null;

    const requestCount = resource.utilization_metrics?.request_count || 0;

    if (requestCount === 0) {
        return {
            resource_id: resource.id,
            rule_type: 'idle_load_balancer',
            severity: 'medium',
            estimated_monthly_waste: resource.simulated_monthly_cost,
            details: `Load Balancer ${resource.resource_identifier} has 0 requests flowing through it.`
        };
    }
    return null;
}

// Rule 5: Stale Snapshot
export function checkStaleSnapshot(resource: CloudResource): Finding | null {
    if (resource.resource_type !== 'Snapshot') return null;

    const daysOld = resource.config?.age_in_days || 0;

    if (daysOld > 30) {
        return {
            resource_id: resource.id,
            rule_type: 'stale_snapshot',
            severity: 'low',
            estimated_monthly_waste: resource.simulated_monthly_cost,
            details: `Snapshot ${resource.resource_identifier} is ${daysOld} days old and likely no longer needed.`
        };
    }
    return null;
}

// Rule 6: S3 with no lifecycle policy
export function checkS3Lifecycle(resource: CloudResource): Finding | null {
    if (resource.resource_type !== 'S3') return null;

    const hasLifecyclePolicy = resource.config?.has_lifecycle_policy || false;

    if (!hasLifecyclePolicy) {
        return {
            resource_id: resource.id,
            rule_type: 's3_no_lifecycle',
            severity: 'low',
            estimated_monthly_waste: resource.simulated_monthly_cost * 0.2,
            details: `S3 Bucket ${resource.resource_identifier} has no lifecycle policy. Data is not being archived or cleaned up.`
        };
    }
    return null;
}

// 3. Master Runner Function
export function runRulesEngine(resources: CloudResource[]): Finding[] {
    const findings: Finding[] = [];
    
    const rules = [
        checkIdleEC2,
        checkOversizedEC2,
        checkUnattachedEBS,
        checkIdleELB,
        checkStaleSnapshot,
        checkS3Lifecycle
    ];

    for (const resource of resources) {
        for (const rule of rules) {
            const finding = rule(resource);
            if (finding) {
                findings.push(finding);
            }
        }
    }

    return findings;
}