import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Import Aditya's rules engine here. (You may need to ask him the exact file path/name)
// For example: import { detectWaste } from '@/lib/rules-engine'; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing Supabase env vars' }, { status: 500 });
  }

  // Use service role key to bypass RLS for the scan operation
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Fetch all resources from the database
    const { data: resources, error: fetchError } = await supabase
      .from('resources')
      .select('*');

    if (fetchError) throw fetchError;
    if (!resources || resources.length === 0) {
      return NextResponse.json({ message: 'No resources found to scan.' });
    }

    // 2. Run the rules engine against each resource
    // NOTE: Talk to Aditya to confirm the exact function name he used in his rules engine!
    const findingsToInsert = [];
    
    for (const resource of resources) {
      // Assuming Aditya's function is called `detectWaste` and takes a resource object
      // const finding = detectWaste(resource); 
      
      // --- TEMPORARY MOCK LOGIC (If Aditya hasn't exported his function yet) ---
      let finding = null;
      if (resource.is_wasteful && resource.waste_reason) {
        finding = {
          resource_id: resource.id,
          severity: 'High',
          estimated_monthly_waste: resource.monthly_cost, // Simplified for now
          status: 'pending',
          description: resource.waste_reason
        };
      }
      // ------------------------------------------------------------------------

      if (finding) {
        findingsToInsert.push(finding);
      }
    }

    // 3. Clear old pending findings so we don't duplicate them on re-scan
    await supabase
      .from('findings')
      .delete()
      .eq('status', 'pending');

    // 4. Insert the new findings into the findings table
    if (findingsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('findings')
        .insert(findingsToInsert);

      if (insertError) throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Scan complete. Found ${findingsToInsert.length} wasteful resources.`,
      findings_count: findingsToInsert.length
    });

  } catch (error: any) {
    console.error('Scan API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}