import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get the finding ID from the request
    const { finding_id } = await request.json();
    if (!finding_id) {
      return NextResponse.json({ error: 'Missing finding_id' }, { status: 400 });
    }

    // 2. Fetch the finding to get the resource_id
    const { data: finding, error: findingError } = await supabase
      .from('findings')
      .select('id, resource_id')
      .eq('id', finding_id)
      .single();

    if (findingError || !finding) {
      return NextResponse.json({ error: 'Finding not found' }, { status: 404 });
    }

    // 3. Apply the fix to the mock resource! (Terminate it and drop cost to 0)
    const { error: resourceError } = await supabase
      .from('resources')
      .update({ 
        state: 'terminated',
        monthly_cost: 0,
        is_wasteful: false,
        waste_reason: null
      })
      .eq('id', finding.resource_id);

    if (resourceError) throw resourceError;

    // 4. Update the finding status to 'applied'
    await supabase
      .from('findings')
      .update({ 
        status: 'applied',
        resolved_at: new Date().toISOString()
      })
      .eq('id', finding_id);

    return NextResponse.json({ 
      success: true, 
      message: "Fix applied successfully. Resource terminated and bill recalculated."
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}