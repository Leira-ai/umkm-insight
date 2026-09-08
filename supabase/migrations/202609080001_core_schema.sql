begin;

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Pengguna' check (char_length(display_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  timezone text not null default 'Asia/Jakarta' check (timezone = 'Asia/Jakarta'),
  currency_code text not null default 'IDR' check (currency_code = 'IDR'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'writer', 'viewer')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, profile_id),
  unique (business_id, id),
  unique (business_id, profile_id, status)
);

create table public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  sku text not null check (char_length(sku) between 1 and 64),
  name text not null check (char_length(name) between 1 and 160),
  unit_price bigint not null check (unit_price between 0 and 9000000000000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, sku),
  unique (business_id, id)
);

create table public.import_batches (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_by uuid,
  source_label text not null check (char_length(source_label) between 1 and 255),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  row_count integer not null default 0 check (row_count >= 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (business_id, id),
  foreign key (business_id, created_by)
    references public.memberships(business_id, profile_id)
);

create table public.transactions (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  import_batch_id uuid,
  created_by uuid,
  transaction_number text not null check (char_length(transaction_number) between 1 and 80),
  occurred_at timestamptz not null,
  business_date date generated always as ((occurred_at at time zone 'Asia/Jakarta')::date) stored,
  subtotal bigint not null default 0 check (subtotal >= 0),
  discount bigint not null default 0 check (discount >= 0 and discount <= subtotal),
  total bigint generated always as (subtotal - discount) stored check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, transaction_number),
  unique (business_id, id),
  foreign key (business_id, import_batch_id)
    references public.import_batches(business_id, id),
  foreign key (business_id, created_by)
    references public.memberships(business_id, profile_id)
);

create table public.transaction_items (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  transaction_id uuid not null,
  product_id uuid not null,
  quantity bigint not null check (quantity between 1 and 1000000),
  unit_price bigint not null check (unit_price between 0 and 9000000000000),
  line_total bigint generated always as (quantity * unit_price) stored,
  created_at timestamptz not null default now(),
  unique (business_id, id),
  foreign key (business_id, transaction_id)
    references public.transactions(business_id, id) on delete cascade,
  foreign key (business_id, product_id)
    references public.products(business_id, id)
);

create index memberships_profile_active_idx
  on public.memberships(profile_id, business_id) where status = 'active';
create index products_business_active_idx
  on public.products(business_id, is_active);
create index import_batches_business_created_idx
  on public.import_batches(business_id, created_at desc);
create index transactions_business_date_idx
  on public.transactions(business_id, business_date desc);
create index transactions_import_batch_idx
  on public.transactions(business_id, import_batch_id) where import_batch_id is not null;
create index transaction_items_transaction_idx
  on public.transaction_items(business_id, transaction_id);
create index transaction_items_product_idx
  on public.transaction_items(business_id, product_id);

commit;
