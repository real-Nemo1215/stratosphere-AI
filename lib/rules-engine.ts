// lib/rules-engine.ts

export interface CloudResource {
  id: string;
  type: 'EC2' | 'RDS' | 'EBS' | 'ELB' | 'S3';
  region: string;
  state?: string;
  tags: string[];
  metrics?: {
    cpuUtilization?: number; // percentage 0-100
    networkIn?: number;
    activeConnections?: number;
  };
  configuration?: {
    volumeSize?: number; // GB
    instanceType?: string;
    ageDays?: number;
    hasLifecyclePolicy?: boolean;
  };
  monthlyCost: number;
}

export interface Finding {
  resourceId: string;
  ruleType: 'idle_instance' | 'oversized_instance' | 'unattached_volume' | 'idle_load_balancer' | 'stale_snapshot' | 's3_no_lifecycle';
  description: string;
  suggestedAction: string;
  estimatedWaste: number;
  severity: 'Low' | 'Medium' | 'High';
}

// Hardened: Pure functions with nullish coalescing and explicit metric checks
export function detectIdleInstance(resource: CloudResource): Finding | null {
  if (resource.type !== 'EC2' && resource.type !== 'RDS') return null;
  const cpu = resource.metrics?.cpuUtilization ?? 100;
  
  if (cpu < 1.0 && resource.state === 'running') {
    return {
      resourceId: resource.id,
      ruleType: 'idle_instance',
      description: `${resource.type} instance has CPU utilization < 1% while running.`,
      suggestedAction: 'terminate',
      estimatedWaste: resource.monthlyCost,
      severity: 'High'
    };
  }
  return null;
}

export function detectOversizedInstance(resource: CloudResource): Finding | null {
  if (resource.type !== 'EC2' && resource.type !== 'RDS') return null;
  const cpu = resource.metrics?.cpuUtilization ?? 100;
  
  if (cpu > 1.0 && cpu < 10.0) {
    return {
      resourceId: resource.id,
      ruleType: 'oversized_instance',
      description: `${resource.type} instance CPU utilization is between 1-10%, indicating it is heavily oversized.`,
      suggestedAction: 'resize',
      estimatedWaste: resource.monthlyCost * 0.5, // Assume 50% savings from downsizing
      severity: 'Medium'
    };
  }
  return null;
}

export function detectUnattachedVolume(resource: CloudResource): Finding | null {
  if (resource.type !== 'EBS') return null;
  if (resource.state === 'available' || resource.metrics?.activeConnections === 0) {
    return {
      resourceId: resource.id,
      ruleType: 'unattached_volume',
      description: 'EBS volume is unattached and incurring costs.',
      suggestedAction: 'delete',
      estimatedWaste: resource.monthlyCost,
      severity: 'Medium'
    };
  }
  return null;
}

export function detectIdleLoadBalancer(resource: CloudResource): Finding | null {
  if (resource.type !== 'ELB') return null;
  const connections = resource.metrics?.activeConnections ?? 100;
  
  if (connections === 0) {
    return {
      resourceId: resource.id,
      ruleType: 'idle_load_balancer',
      description: 'ELB has 0 active healthy targets.',
      suggestedAction: 'delete',
      estimatedWaste: resource.monthlyCost,
      severity: 'Medium'
    };
  }
  return null;
}

export function detectStaleSnapshot(resource: CloudResource): Finding | null {
  // Assuming snapshots are tracked as S3 or EBS with ageDays configuration
  const age = resource.configuration?.ageDays ?? 0;
  
  if (age > 90) {
    return {
      resourceId: resource.id,
      ruleType: 'stale_snapshot',
      description: `Snapshot is ${age} days old (older than 90 days).`,
      suggestedAction: 'delete',
      estimatedWaste: resource.monthlyCost,
      severity: 'Low'
    };
  }
  return null;
}

export function detectS3NoLifecycle(resource: CloudResource): Finding | null {
  if (resource.type !== 'S3') return null;
  const hasPolicy = resource.configuration?.hasLifecyclePolicy ?? true;
  
  if (!hasPolicy) {
    return {
      resourceId: resource.id,
      ruleType: 's3_no_lifecycle',
      description: 'S3 bucket has no lifecycle policy configured, leading to unmanaged storage growth.',
      suggestedAction: 'add_lifecycle_policy',
      estimatedWaste: resource.monthlyCost * 0.3,
      severity: 'Low'
    };
  }
  return null;
}

// Main engine runner
export function runRulesEngine(resources: CloudResource[]): Finding[] {
  const findings: Finding[] = [];
  
  for (const resource of resources) {
    const checks = [
      detectIdleInstance(resource),
      detectOversizedInstance(resource),
      detectUnattachedVolume(resource),
      detectIdleLoadBalancer(resource),
      detectStaleSnapshot(resource),
      detectS3NoLifecycle(resource)
    ];
    
    for (const finding of checks) {
      if (finding) findings.push(finding);
    }
  }
  
  return findings;
}