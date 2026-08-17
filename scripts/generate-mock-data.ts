import { faker } from '@faker-js/faker';
import * as fs from 'fs';

// --- CONFIGURATION ---
const WASTE_RATIO = 0.3; // 30% of resources will be wasteful
const RESOURCE_COUNT = 50;
const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1'];

// Types matching your Day 1 ERD
type ResourceType = 'EC2' | 'RDS' | 'EBS' | 'ELB' | 'S3';

interface CloudResource {
  id: string;
  type: ResourceType;
  region: string;
  monthly_cost: number;
  tags: { key: string; value: string }[];
  metrics: Record<string, number | boolean | string | null>;
  is_wasteful: boolean;
  waste_reason?: string;
}

// Helper to pick a random element
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- GENERATOR FUNCTIONS ---
function generateEC2(isWasteful: boolean): CloudResource {
  const instanceTypes = ['t3.micro', 't3.medium', 'm5.large', 'm5.2xlarge', 'c5.9xlarge'];
  const type = isWasteful ? pick(['m5.2xlarge', 'c5.9xlarge']) : pick(instanceTypes);
  
  let metrics = {
    cpu_utilization: faker.number.float({ min: 10, max: 90 }),
    network_in: faker.number.int({ min: 1000, max: 5000000 }),
  };
  let waste_reason;

  if (isWasteful) {
    // Rule: Idle instance OR Oversized instance
    if (Math.random() > 0.5) {
      metrics.cpu_utilization = faker.number.float({ min: 0.1, max: 4.9 });
      waste_reason = 'Idle EC2 Instance (CPU < 5%)';
    } else {
      metrics.cpu_utilization = faker.number.float({ min: 1, max: 10 });
      waste_reason = 'Oversized EC2 Instance (High specs, low CPU)';
    }
  }

  return {
    id: `i-${faker.string.alphanumeric(17)}`,
    type: 'EC2',
    region: pick(REGIONS),
    monthly_cost: faker.number.float({ min: 15, max: 500 }),
    tags: [{ key: 'Name', value: `web-server-${faker.number.int(100)}` }, { key: 'Environment', value: pick(['prod', 'dev', 'staging']) }],
    metrics,
    is_wasteful: isWasteful,
    waste_reason: waste_reason,
  };
}

function generateRDS(isWasteful: boolean): CloudResource {
  let metrics = {
    cpu_utilization: faker.number.float({ min: 20, max: 80 }),
    active_connections: faker.number.int({ min: 10, max: 100 }),
  };
  let waste_reason;

  if (isWasteful) {
    metrics.cpu_utilization = faker.number.float({ min: 0.1, max: 5 });
    metrics.active_connections = faker.number.int({ min: 0, max: 2 });
    waste_reason = 'Idle RDS Instance (Low CPU & Connections)';
  }

  return {
    id: `db-${faker.string.alphanumeric(17)}`,
    type: 'RDS',
    region: pick(REGIONS),
    monthly_cost: faker.number.float({ min: 50, max: 1500 }),
    tags: [{ key: 'Name', value: `prod-db-${faker.number.int(10)}` }, { key: 'Environment', value: 'prod' }],
    metrics,
    is_wasteful: isWasteful,
    waste_reason: waste_reason,
  };
}

function generateEBS(isWasteful: boolean): CloudResource {
  let metrics: Record<string, number | boolean | string | null> = {
    volume_read_ops: faker.number.int({ min: 1000, max: 1000000 }),
    attached_instance_id: `i-${faker.string.alphanumeric(17)}`,
  };
  let waste_reason;

  if (isWasteful) {
    metrics.volume_read_ops = 0;
    metrics.attached_instance_id = null; // Unattached
    waste_reason = 'Unattached EBS Volume';
  }

  return {
    id: `vol-${faker.string.alphanumeric(17)}`,
    type: 'EBS',
    region: pick(REGIONS),
    monthly_cost: faker.number.float({ min: 5, max: 100 }),
    tags: [{ key: 'Name', value: `data-volume-${faker.number.int(50)}` }],
    metrics,
    is_wasteful: isWasteful,
    waste_reason: waste_reason,
  };
}

function generateELB(isWasteful: boolean): CloudResource {
  let metrics = {
    request_count: faker.number.int({ min: 10000, max: 5000000 }),
    healthy_host_count: faker.number.int({ min: 2, max: 10 }),
  };
  let waste_reason;

  if (isWasteful) {
    metrics.request_count = faker.number.int({ min: 0, max: 50 });
    waste_reason = 'Idle Load Balancer (No Traffic)';
  }

  return {
    id: `lb-${faker.string.alphanumeric(17)}`,
    type: 'ELB',
    region: pick(REGIONS),
    monthly_cost: faker.number.float({ min: 20, max: 100 }),
    tags: [{ key: 'Name', value: `public-lb-${faker.number.int(5)}` }],
    metrics,
    is_wasteful: isWasteful,
    waste_reason: waste_reason,
  };
}

function generateS3(isWasteful: boolean): CloudResource {
  let metrics = {
    bucket_size_gb: faker.number.int({ min: 1, max: 5000 }),
    has_lifecycle_policy: true,
    stale_objects_gb: 0,
  };
  let waste_reason;

  if (isWasteful) {
    metrics.has_lifecycle_policy = false;
    metrics.stale_objects_gb = faker.number.int({ min: 100, max: 2000 });
    waste_reason = 'S3 Bucket missing Lifecycle Policy';
  }

  return {
    id: `s3-bucket-${faker.string.alphanumeric(10)}`,
    type: 'S3',
    region: pick(REGIONS),
    monthly_cost: faker.number.float({ min: 10, max: 300 }),
    tags: [{ key: 'Name', value: `app-logs-${faker.number.int(20)}` }],
    metrics,
    is_wasteful: isWasteful,
    waste_reason: waste_reason,
  };
}

// --- MAIN EXECUTION ---
function generateData() {
  const resources: CloudResource[] = [];
  const wasteCount = Math.floor(RESOURCE_COUNT * WASTE_RATIO);
  const healthyCount = RESOURCE_COUNT - wasteCount;

  // Create arrays to track which resources need to be wasteful vs healthy
  const wasteFlags = [...Array(wasteCount).fill(true), ...Array(healthyCount).fill(false)];
  
  // Shuffle the flags so waste is distributed randomly across resource types
  for (let i = wasteFlags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wasteFlags[i], wasteFlags[j]] = [wasteFlags[j], wasteFlags[i]];
  }

  for (let i = 0; i < RESOURCE_COUNT; i++) {
    const isWasteful = wasteFlags[i];
    const type = pick(['EC2', 'RDS', 'EBS', 'ELB', 'S3']) as ResourceType;
    
    switch (type) {
      case 'EC2': resources.push(generateEC2(isWasteful)); break;
      case 'RDS': resources.push(generateRDS(isWasteful)); break;
      case 'EBS': resources.push(generateEBS(isWasteful)); break;
      case 'ELB': resources.push(generateELB(isWasteful)); break;
      case 'S3': resources.push(generateS3(isWasteful)); break;
    }
  }

  // Output to a JSON file
  const outputPath = './scripts/mock-cloud-data.json';
  fs.writeFileSync(outputPath, JSON.stringify(resources, null, 2));
  console.log(`✅ Successfully generated ${RESOURCE_COUNT} mock resources (${wasteCount} wasteful, ${healthyCount} healthy) at ${outputPath}`);
}

generateData();