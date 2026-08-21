import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(supabaseUrl, supabaseKey);
}

// ==========================================
// 1. FINDINGS API: Get all findings for UI
// ==========================================
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('findings')
      .select(`
        *,
        resources (
          type,
          region,
          cloud_resource_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, findings: data });
  } catch (error: any) {
    console.error('GET Findings API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 2. APPROVAL API: Approve or Reject a finding
// ==========================================
export async function PATCH(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const { data, error } = await supabase
      .from('findings')
      .update({ 
        status: newStatus,
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Finding ${newStatus} successfully.`,
      finding: data[0]
    });
  } catch (error: any) {
    console.error('PATCH Approval API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 3. APPLY-FIX API: Terminate resource & drop bill
// ==========================================
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { finding_id } = await request.json();

    if (!finding_id) {
      return NextResponse.json({ error: 'Missing finding_id' }, { status: 400 });
    }

    const { data: finding, error: findingError } = await supabase
      .from('findings')
      .select('id, resource_id')
      .eq('id', finding_id)
      .single();

    if (findingError || !finding) {
      return NextResponse.json({ error: 'Finding not found' }, { status: 404 });
    }

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