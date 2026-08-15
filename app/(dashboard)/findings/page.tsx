"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, CheckCircle, XCircle } from "lucide-react";

interface Finding {
  id: number;
  resource: string;
  issue: string;
  risk: "High" | "Medium" | "Low";
  savings: string;
  status: "pending" | "approved" | "rejected";
  codeSnippet?: string;
}

const initialFindings: Finding[] = [
  { 
    id: 1, 
    resource: "EC2 - i-0abcd1234", 
    issue: "Idle Instance (0% CPU for 14 days)", 
    risk: "High", 
    savings: "$320/mo",
    status: "pending",
    codeSnippet: `import boto3\n\ndef terminate_idle_ec2():\n    ec2 = boto3.client('ec2', region_name='us-east-1')\n    response = ec2.terminate_instances(InstanceIds=['i-0abcd1234'])\n    print("Terminated idle instance: i-0abcd1234")\n    return response`
  },
  { 
    id: 2, 
    resource: "RDS - db-prod-x1", 
    issue: "Oversized Instance (t3.2xlarge)", 
    risk: "Medium", 
    savings: "$850/mo",
    status: "pending",
    codeSnippet: `import boto3\n\ndef resize_rds_instance():\n    rds = boto3.client('rds', region_name='us-east-1')\n    response = rds.modify_db_instance(\n        DBInstanceIdentifier='db-prod-x1',\n        DBInstanceClass='db.t3.large',\n        ApplyImmediately=True\n    )\n    return response`
  },
  { 
    id: 3, 
    resource: "EBS - vol-09876", 
    issue: "Unattached Volume", 
    risk: "Low", 
    savings: "$45/mo",
    status: "pending",
    codeSnippet: `import boto3\n\ndef delete_unattached_ebs():\n    ec2 = boto3.client('ec2', region_name='us-east-1')\n    ec2.delete_volume(VolumeId='vol-09876')\n    print("Deleted unattached volume: vol-09876")`
  },
];

export default function FindingsListPage() {
  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setFindings(findings.map(f => f.id === id ? { ...f, status: "approved" } : f));
  };

  const handleReject = (id: number) => {
    setFindings(findings.map(f => f.id === id ? { ...f, status: "rejected" } : f));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Active Findings</h1>
        <p className="text-muted-foreground">Review AI-generated fixes and apply them to save money.</p>
      </div>

      <div className="space-y-4">
        {findings.map((f) => (
          <Card key={f.id} className={f.status !== "pending" ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">{f.resource}</CardTitle>
                <div className="flex items-center gap-2">
                  {f.status === "approved" && (
                    <Badge className="bg-green-600 text-white flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Approved & Applied
                    </Badge>
                  )}
                  {f.status === "rejected" && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Rejected
                    </Badge>
                  )}
                  {f.status === "pending" && (
                    <Badge variant={f.risk === "High" ? "destructive" : f.risk === "Medium" ? "default" : "secondary"}>
                      Risk: {f.risk}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{f.issue}</p>
              
              {selectedCode === f.id && f.codeSnippet && (
                <div className="mb-4 p-4 bg-primary text-primary-foreground font-mono text-xs rounded-lg overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-muted pb-2 border-b border-primary/40">
                    <Code className="h-4 w-4" /> AI Generated Remediation Script (boto3)
                  </div>
                  <pre>{f.codeSnippet}</pre>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Est. Savings: {f.savings}
                </Badge>
                {f.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCode(selectedCode === f.id ? null : f.id)}
                    >
                      {selectedCode === f.id ? "Hide Code" : "View AI Fix Code"}
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(f.id)}
                    >
                      Approve & Apply
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleReject(f.id)}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setFindings(findings.map(item => item.id === f.id ? { ...item, status: "pending" } : item))}>
                    Reset Action
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
