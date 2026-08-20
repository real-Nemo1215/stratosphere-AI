// scripts/stress-test-ai.ts
import { generateAiFix } from '../lib/ai-fix-engine';

const mockFindings = [
  { type: 'idle_instance', description: 'EC2 CPU utilization < 1% for 14 days', suggestedAction: 'terminate', estimatedWaste: 45 },
  { type: 'oversized_instance', description: 'EC2 CPU utilization < 10% but memory < 20%', suggestedAction: 'resize', estimatedWaste: 120 },
  { type: 'unattached_volume', description: 'EBS volume has no attachments for 7 days', suggestedAction: 'delete', estimatedWaste: 30 },
  { type: 'idle_load_balancer', description: 'ELB has 0 healthy targets', suggestedAction: 'delete', estimatedWaste: 90 },
  { type: 'stale_snapshot', description: 'Snapshot older than 90 days', suggestedAction: 'delete', estimatedWaste: 15 },
  { type: 's3_no_lifecycle', description: 'S3 bucket has no lifecycle policy', suggestedAction: 'add_lifecycle_policy', estimatedWaste: 200 }
];

const devResource = { id: 'res-dev-123', type: 'EC2', tags: ['dev', 'staging'] };
const prodResource = { id: 'res-prod-456', type: 'EC2', tags: ['production', 'web-frontend'] };

async function runStressTests() {
  console.log('--- STARTING AI STRESS TESTS (Day 5) ---\n');

  for (const finding of mockFindings) {
    console.log(`Testing Rule: ${finding.type}`);

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