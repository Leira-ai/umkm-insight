begin;
select plan(16);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'tenant-a@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Tenant A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'tenant-b@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Tenant B"}', now(), now());

insert into public.businesses (id, name)
values
  ('10000000-0000-4000-8100-000000000001', 'Tenant A Business'),
  ('20000000-0000-4000-8100-000000000001', 'Tenant B Business');

insert into public.memberships (id, business_id, profile_id, role, status)
values
  ('10000000-0000-4000-8200-000000000001', '10000000-0000-4000-8100-000000000001', '10000000-0000-4000-8000-000000000001', 'writer', 'active'),
  ('20000000-0000-4000-8200-000000000001', '20000000-0000-4000-8100-000000000001', '20000000-0000-4000-8000-000000000001', 'writer', 'active');

insert into public.products (id, business_id, sku, name, unit_price)
values
  ('10000000-0000-4000-8300-000000000001', '10000000-0000-4000-8100-000000000001', 'A-1', 'Tenant A Product', 10000),
  ('20000000-0000-4000-8300-000000000001', '20000000-0000-4000-8100-000000000001', 'B-1', 'Tenant B Product', 20000);

insert into public.transactions (
  id, business_id, created_by, transaction_number, occurred_at
)
values
  ('10000000-0000-4000-8400-000000000001', '10000000-0000-4000-8100-000000000001', '10000000-0000-4000-8000-000000000001', 'A-TX-1', '2026-09-08 17:30:00+00'),
  ('20000000-0000-4000-8400-000000000001', '20000000-0000-4000-8100-000000000001', '20000000-0000-4000-8000-000000000001', 'B-TX-1', '2026-09-08 08:00:00+00');

insert into public.transaction_items (
  id, business_id, transaction_id, product_id, quantity, unit_price
)
values
  ('10000000-0000-4000-8500-000000000001', '10000000-0000-4000-8100-000000000001', '10000000-0000-4000-8400-000000000001', '10000000-0000-4000-8300-000000000001', 2, 10000),
  ('20000000-0000-4000-8500-000000000001', '20000000-0000-4000-8100-000000000001', '20000000-0000-4000-8400-000000000001', '20000000-0000-4000-8300-000000000001', 1, 20000);

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

select is((select count(*) from public.businesses), 1::bigint, 'tenant A sees one business');
select is((select id from public.businesses), '10000000-0000-4000-8100-000000000001'::uuid, 'tenant A sees only its business');
select is((select count(*) from public.memberships), 1::bigint, 'tenant A sees no tenant B membership');
select is((select count(*) from public.profiles), 1::bigint, 'tenant A sees no tenant B profile');
select is((select count(*) from public.products), 1::bigint, 'tenant A sees no tenant B product');
select is((select count(*) from public.transactions), 1::bigint, 'tenant A sees no tenant B transaction');
select is((select count(*) from public.transaction_items), 1::bigint, 'tenant A sees no tenant B transaction item');
select is((select business_date from public.transactions), '2026-09-09'::date, 'business date uses Asia/Jakarta');
select is((select subtotal from public.transactions), 20000::bigint, 'item trigger derives subtotal');
select is((select total from public.transactions), 20000::bigint, 'generated total derives net Rupiah');
select is((select count(*) from public.import_batches), 0::bigint, 'tenant A sees no import batches initially');

select lives_ok(
  $$insert into public.products (business_id, sku, name, unit_price)
    values ('10000000-0000-4000-8100-000000000001', 'A-2', 'Allowed Product', 15000)$$,
  'writer can insert in own tenant'
);

select throws_ok(
  $$insert into public.products (business_id, sku, name, unit_price)
    values ('20000000-0000-4000-8100-000000000001', 'B-X', 'Blocked Product', 15000)$$,
  '42501', null,
  'writer cannot insert in tenant B'
);

select is(
  (select count(*) from public.products
   where id = '20000000-0000-4000-8300-000000000001'
     and name = 'Blocked Rename'),
  0::bigint,
  'tenant B update target is invisible before mutation'
);

update public.products set name = 'Blocked Rename'
where id = '20000000-0000-4000-8300-000000000001';

select is(
  (select count(*) from public.products
   where id = '20000000-0000-4000-8300-000000000001'
     and name = 'Blocked Rename'),
  0::bigint,
  'tenant B remains invisible after blocked update'
);

select throws_ok(
  $$insert into public.transaction_items (
      business_id, transaction_id, product_id, quantity, unit_price
    ) values (
      '10000000-0000-4000-8100-000000000001',
      '10000000-0000-4000-8400-000000000001',
      '20000000-0000-4000-8300-000000000001', 1, 20000
    )$$,
  '23503', null,
  'composite FK prevents cross-tenant product relationship'
);

select * from finish();
rollback;
