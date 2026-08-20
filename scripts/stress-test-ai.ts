// scripts/stress-test-ai.ts
import { generateAiFix } from '../lib/ai-fix-engine';
import { Finding, CloudResource } from '../lib/rules-engine';

const mockFindings: Finding[] = [
  { resourceId: 'res-dev-123', ruleType: 'idle_instance', description: 'EC2 CPU utilization < 1% for 14 days', suggestedAction: 'terminate', estimatedWaste: 45, severity: 'High' },
  { resourceId: 'res-dev-123', ruleType: 'oversized_instance', description: 'EC2 CPU utilization < 10% but memory < 20%', suggestedAction: 'resize', estimatedWaste: 120, severity: 'Medium' },
  { resourceId: 'res-dev-123', ruleType: 'unattached_volume', description: 'EBS volume has no attachments for 7 days', suggestedAction: 'delete', estimatedWaste: 30, severity: 'Medium' },
  { resourceId: 'res-dev-123', ruleType: 'idle_load_balancer', description: 'ELB has 0 healthy targets', suggestedAction: 'delete', estimatedWaste: 90, severity: 'Medium' },
  { resourceId: 'res-dev-123', ruleType: 'stale_snapshot', description: 'Snapshot older than 90 days', suggestedAction: 'delete', estimatedWaste: 15, severity: 'Low' },
  { resourceId: 'res-dev-123', ruleType: 's3_no_lifecycle', description: 'S3 bucket has no lifecycle policy', suggestedAction: 'add_lifecycle_policy', estimatedWaste: 200, severity: 'Low' }
];

const devResource: CloudResource = {
  id: 'res-dev-123',
  type: 'EC2',
  region: 'us-east-1',
  state: 'running',
  tags: ['dev', 'staging'],
  monthlyCost: 100
};

const prodResource: CloudResource = {
  id: 'res-prod-456',
  type: 'EC2',
  region: 'us-east-1',
  state: 'running',
  tags: ['production', 'web-frontend'],
  monthlyCost: 500
};

async function runStressTests() {
  console.log('--- STARTING AI STRESS TESTS (Day 5/6) ---\n');

  for (const finding of mockFindings) {
    console.log(`Testing Rule: ${finding.ruleType}`);

    // Test 1: Dev Environment (Should generate code normally)
    const devResult = await generateAiFix(finding, devResource);
    console.log(`  [DEV] Risk Level: ${devResult.riskLevel} | Code Generated: ${devResult.fixCode ? 'Yes' : 'No'}`);

    // Test 2: Production Environment (Should block destructive actions)
    const prodResult = await generateAiFix(finding, prodResource);
    console.log(`  [PROD] Risk Level: ${prodResult.riskLevel} | Explanation: ${prodResult.explanation.substring(0, 50)}...`);
    
    console.log('---');
  }

  console.log('\n--- STRESS TESTS COMPLETE ---');
}

runStressTests();