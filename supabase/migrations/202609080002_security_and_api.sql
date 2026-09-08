begin;

create or replace function private.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = pg_catalog, auth
as $$
  select auth.uid()
$$;

create or replace function private.is_active_member(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.business_id = target_business_id
      and m.profile_id = (select private.current_user_id())
      and m.status = 'active'
  )
$$;

create or replace function private.can_write_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.business_id = target_business_id
      and m.profile_id = (select private.current_user_id())
      and m.status = 'active'
      and m.role in ('owner', 'writer')
  )
$$;

create or replace function private.can_manage_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.business_id = target_business_id
      and m.profile_id = (select private.current_user_id())
      and m.status = 'active'
      and m.role = 'owner'
  )
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.sync_transaction_total()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  old_business_id uuid := old.business_id;
  old_transaction_id uuid := old.transaction_id;
  new_business_id uuid := new.business_id;
  new_transaction_id uuid := new.transaction_id;
begin
  if tg_op <> 'INSERT' then
    update public.transactions t
    set subtotal = coalesce((
          select sum(i.line_total)
          from public.transaction_items i
          where i.business_id = old_business_id
            and i.transaction_id = old_transaction_id
        ), 0)
    where t.business_id = old_business_id
      and t.id = old_transaction_id;
  end if;

  if tg_op <> 'DELETE'
     and (tg_op <> 'UPDATE' or (new_business_id, new_transaction_id) is distinct from (old_business_id, old_transaction_id)) then
    update public.transactions t
    set subtotal = coalesce((
          select sum(i.line_total)
          from public.transaction_items i
          where i.business_id = new_business_id
            and i.transaction_id = new_transaction_id
        ), 0)
    where t.business_id = new_business_id
      and t.id = new_transaction_id;
  end if;
  return null;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(left(trim(new.raw_user_meta_data ->> 'display_name'), 100), ''),
      'Pengguna'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on all functions in schema private from public;
revoke all on schema private from anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();
create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function private.set_updated_at();
create trigger memberships_set_updated_at
before update on public.memberships
for each row execute function private.set_updated_at();
create trigger products_set_updated_at
before update on public.products
for each row execute function private.set_updated_at();
create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function private.set_updated_at();

create trigger transaction_items_sync_total
after insert or update or delete on public.transaction_items
for each row execute function private.sync_transaction_total();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.memberships enable row level security;
alter table public.products enable row level security;
alter table public.import_batches enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;

alter table public.profiles force row level security;
alter table public.businesses force row level security;
alter table public.memberships force row level security;
alter table public.products force row level security;
alter table public.import_batches force row level security;
alter table public.transactions force row level security;
alter table public.transaction_items force row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, update, delete on public.businesses to authenticated;
grant select, insert, update, delete on public.memberships to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.import_batches to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.transaction_items to authenticated;

create policy profiles_select_self
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy profiles_update_self
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy businesses_select_member
on public.businesses for select to authenticated
using ((select private.is_active_member(id)));

create policy businesses_update_owner
on public.businesses for update to authenticated
using ((select private.can_manage_business(id)))
with check ((select private.can_manage_business(id)));

create policy businesses_delete_owner
on public.businesses for delete to authenticated
using ((select private.can_manage_business(id)));

create policy memberships_select_member
on public.memberships for select to authenticated
using ((select private.is_active_member(business_id)));

create policy memberships_insert_owner
on public.memberships for insert to authenticated
with check (
  (select private.can_manage_business(business_id))
  and profile_id <> (select auth.uid())
  and role <> 'owner'
);

create policy memberships_update_owner
on public.memberships for update to authenticated
using (
  (select private.can_manage_business(business_id))
  and profile_id <> (select auth.uid())
)
with check (
  (select private.can_manage_business(business_id))
  and profile_id <> (select auth.uid())
  and role <> 'owner'
);

create policy memberships_delete_owner
on public.memberships for delete to authenticated
using (
  (select private.can_manage_business(business_id))
  and profile_id <> (select auth.uid())
);

create policy products_select_member
on public.products for select to authenticated
using ((select private.is_active_member(business_id)));

create policy products_insert_writer
on public.products for insert to authenticated
with check ((select private.can_write_business(business_id)));

create policy products_update_writer
on public.products for update to authenticated
using ((select private.can_write_business(business_id)))
with check ((select private.can_write_business(business_id)));

create policy products_delete_writer
on public.products for delete to authenticated
using ((select private.can_write_business(business_id)));

create policy import_batches_select_member
on public.import_batches for select to authenticated
using ((select private.is_active_member(business_id)));

create policy import_batches_insert_writer
on public.import_batches for insert to authenticated
with check (
  (select private.can_write_business(business_id))
  and created_by = (select auth.uid())
);

create policy import_batches_update_writer
on public.import_batches for update to authenticated
using ((select private.can_write_business(business_id)))
with check (
  (select private.can_write_business(business_id))
  and created_by = (select auth.uid())
);

create policy import_batches_delete_writer
on public.import_batches for delete to authenticated
using ((select private.can_write_business(business_id)));

create policy transactions_select_member
on public.transactions for select to authenticated
using ((select private.is_active_member(business_id)));

create policy transactions_insert_writer
on public.transactions for insert to authenticated
with check (
  (select private.can_write_business(business_id))
  and created_by = (select auth.uid())
);

create policy transactions_update_writer
on public.transactions for update to authenticated
using ((select private.can_write_business(business_id)))
with check (
  (select private.can_write_business(business_id))
  and created_by = (select auth.uid())
);

create policy transactions_delete_writer
on public.transactions for delete to authenticated
using ((select private.can_write_business(business_id)));

create policy transaction_items_select_member
on public.transaction_items for select to authenticated
using ((select private.is_active_member(business_id)));

create policy transaction_items_insert_writer
on public.transaction_items for insert to authenticated
with check ((select private.can_write_business(business_id)));

create policy transaction_items_update_writer
on public.transaction_items for update to authenticated
using ((select private.can_write_business(business_id)))
with check ((select private.can_write_business(business_id)));

create policy transaction_items_delete_writer
on public.transaction_items for delete to authenticated
using ((select private.can_write_business(business_id)));

-- Business creation is atomic because direct business inserts are not granted.
create or replace function public.create_business_v1(business_name text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  caller_id uuid := auth.uid();
  new_business_id uuid;
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  if nullif(trim(business_name), '') is null or char_length(trim(business_name)) > 120 then
    raise exception 'business_name must be 1-120 characters' using errcode = '22023';
  end if;

  insert into public.profiles (id, display_name)
  values (caller_id, 'Pengguna')
  on conflict (id) do nothing;

  insert into public.businesses (name)
  values (trim(business_name))
  returning id into new_business_id;

  insert into public.memberships (business_id, profile_id, role, status)
  values (new_business_id, caller_id, 'owner', 'active');

  return new_business_id;
end;
$$;

revoke all on function public.create_business_v1(text) from public, anon;
grant execute on function public.create_business_v1(text) to authenticated;

create or replace function public.get_demo_dashboard_v1()
returns table (
  business_name text,
  currency_code text,
  period_start date,
  period_end date,
  gross_revenue bigint,
  transaction_count bigint,
  average_order_value bigint,
  products_sold bigint,
  daily_revenue jsonb,
  top_products jsonb
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  with demo as (
    select b.id, b.name, b.currency_code
    from public.businesses b
    where b.id = '00000000-0000-4000-8000-000000000001'::uuid
  ), bounds as (
    select min(t.business_date) as period_start,
           max(t.business_date) as period_end
    from public.transactions t
    join demo d on d.id = t.business_id
  ), totals as (
    select coalesce(sum(t.total), 0)::bigint as gross_revenue,
           count(*)::bigint as transaction_count,
           coalesce(round(avg(t.total)), 0)::bigint as average_order_value
    from public.transactions t
    join demo d on d.id = t.business_id
  ), sold as (
    select coalesce(sum(i.quantity), 0)::bigint as products_sold
    from public.transaction_items i
    join demo d on d.id = i.business_id
  ), daily as (
    select coalesce(jsonb_agg(
      jsonb_build_object('date', x.business_date, 'revenue', x.revenue)
      order by x.business_date
    ), '[]'::jsonb) as data
    from (
      select t.business_date, sum(t.total)::bigint as revenue
      from public.transactions t
      join demo d on d.id = t.business_id
      group by t.business_date
    ) x
  ), top as (
    select coalesce(jsonb_agg(
      jsonb_build_object('name', x.product_name, 'quantity', x.quantity, 'revenue', x.revenue)
      order by x.revenue desc, x.product_name
    ), '[]'::jsonb) as data
    from (
      select p.name as product_name,
             sum(i.quantity)::bigint as quantity,
             sum(i.line_total)::bigint as revenue
      from public.transaction_items i
      join demo d on d.id = i.business_id
      join public.products p
        on p.business_id = i.business_id and p.id = i.product_id
      group by p.id, p.name
      order by revenue desc, p.name
      limit 5
    ) x
  )
  select d.name, d.currency_code, b.period_start, b.period_end,
         t.gross_revenue, t.transaction_count, t.average_order_value,
         s.products_sold, dy.data, tp.data
  from demo d
  cross join bounds b
  cross join totals t
  cross join sold s
  cross join daily dy
  cross join top tp
$$;

revoke all on function public.get_demo_dashboard_v1() from public;
grant execute on function public.get_demo_dashboard_v1() to anon, authenticated;

commit;
