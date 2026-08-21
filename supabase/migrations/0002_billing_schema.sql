-- =============================================================
  v_month          date := date_trunc('month', now())::date;
  v_cap            int;
begin
  -- Resolve current subscription (active or trialing)
  select * into v_sub
    from public.subscriptions s
   where s.organization_id = p_org_id
     and s.status in ('active','trialing')
   order by created_at desc limit 1;
  if not found then return false; end if;

  select * into v_plan from public.plans where id = v_sub.plan_id;
  if not found then return false; end if;

  -- Resolve the cap for the requested counter
  v_cap := case p_counter
    when 'resources_scanned'    then v_plan.max_resources_per_month
    when 'ai_fixes_generated'   then v_plan.max_ai_fixes_per_month
    else null
  end;

  -- null cap = unlimited (Enterprise)
  if v_cap is null then
    update public.usage_counters
       set resources_scanned = resources_scanned +
              case when p_counter = 'resources_scanned'  then p_increment else 0 end,
           ai_fixes_generated = ai_fixes_generated +
              case when p_counter = 'ai_fixes_generated' then p_increment else 0 end,
           updated_at = now()
     where organization_id = p_org_id and period_month = v_month;
    if not found then
      insert into public.usage_counters (organization_id, period_month,
                                         resources_scanned, ai_fixes_generated)
      values (p_org_id, v_month,
              case when p_counter = 'resources_scanned'  then p_increment else 0 end,
              case when p_counter = 'ai_fixes_generated' then p_increment else 0 end)
      on conflict (organization_id, period_month) do update
        set resources_scanned = public.usage_counters.resources_scanned + excluded.resources_scanned,
            ai_fixes_generated = public.usage_counters.ai_fixes_generated + excluded.ai_fixes_generated,
            updated_at = now();
    end if;
    return true;
  end if;

  -- Capped plan: check then increment atomically
  select case p_counter
           when 'resources_scanned'  then resources_scanned
           when 'ai_fixes_generated' then ai_fixes_generated
         end into v_current
    from public.usage_counters
   where organization_id = p_org_id and period_month = v_month;

  v_current := coalesce(v_current, 0);
  if v_current + p_increment > v_cap then
    return false;
  end if;

  insert into public.usage_counters (organization_id, period_month,
                                     resources_scanned, ai_fixes_generated)
  values (p_org_id, v_month,
          case when p_counter = 'resources_scanned'  then p_increment else 0 end,
          case when p_counter = 'ai_fixes_generated' then p_increment else 0 end)
  on conflict (organization_id, period_month) do update
    set resources_scanned  = public.usage_counters.resources_scanned  + excluded.resources_scanned,
        ai_fixes_generated = public.usage_counters.ai_fixes_generated + excluded.ai_fixes_generated,
        updated_at = now();
  return true;
end;
 $$;