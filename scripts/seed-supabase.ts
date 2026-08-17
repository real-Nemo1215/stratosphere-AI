import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables. Check your .env.local file.');
  process.exit(1);
}

// Use service role client to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Reading mock data...');
  const filePath = path.join(__dirname, 'mock-cloud-data.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const mockData = JSON.parse(rawData);

  console.log(`Found ${mockData.length} resources. Seeding into Supabase...`);

  // Map the generated JSON to match our database schema
  // Map the generated JSON to match our database schema
  const dbRecords = mockData.map((resource: any) => ({
    cloud_resource_id: resource.id,
    cloud_account_id: '123e4567-e89b-12d3-a456-426614174000', // <-- ADD THIS LINE (fake demo account UUID)
    type: resource.type,
    region: resource.region,
    monthly_cost: resource.monthly_cost,
    tags: resource.tags,
    metrics: resource.metrics,
    is_wasteful: resource.is_wasteful,
    waste_reason: resource.waste_reason
  }));

  // Insert into Supabase
  const { error } = await supabase
    .from('resources')
    .insert(dbRecords);

  if (error) {
    console.error('❌ Error seeding database:', error.message);
  } else {
    console.log('✅ Successfully seeded Supabase with mock cloud resources!');
  }
}

seedDatabase();