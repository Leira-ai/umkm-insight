begin;
select plan(27);

select has_table('public', 'profiles', 'profiles exists');
select has_table('public', 'businesses', 'businesses exists');
select has_table('public', 'memberships', 'memberships exists');
select has_table('public', 'products', 'products exists');
select has_table('public', 'import_batches', 'import_batches exists');
select has_table('public', 'transactions', 'transactions exists');
select has_table('public', 'transaction_items', 'transaction_items exists');

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.businesses'::regclass), 'businesses has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.memberships'::regclass), 'memberships has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.products'::regclass), 'products has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.import_batches'::regclass), 'import_batches has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.transactions'::regclass), 'transactions has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.transaction_items'::regclass), 'transaction_items has RLS');

select ok(not has_table_privilege('anon', 'public.profiles', 'SELECT'), 'anon cannot select profiles');
select ok(not has_table_privilege('anon', 'public.businesses', 'SELECT'), 'anon cannot select businesses');
select ok(not has_table_privilege('anon', 'public.memberships', 'SELECT'), 'anon cannot select memberships');
select ok(not has_table_privilege('anon', 'public.products', 'SELECT'), 'anon cannot select products');
select ok(not has_table_privilege('anon', 'public.import_batches', 'SELECT'), 'anon cannot select import batches');
select ok(not has_table_privilege('anon', 'public.transactions', 'SELECT'), 'anon cannot select transactions');
select ok(not has_table_privilege('anon', 'public.transaction_items', 'SELECT'), 'anon cannot select transaction items');
select ok(not has_table_privilege('authenticated', 'public.businesses', 'INSERT'), 'business inserts require RPC');
select ok(has_function_privilege('anon', 'public.get_demo_dashboard_v1()', 'EXECUTE'), 'anon can execute safe demo aggregate');
select ok(not has_function_privilege('anon', 'public.create_business_v1(text)', 'EXECUTE'), 'anon cannot create businesses');
select ok(not has_schema_privilege('anon', 'private', 'USAGE'), 'anon cannot access private helpers');
select ok(not has_schema_privilege('authenticated', 'private', 'USAGE'), 'authenticated has no direct private schema usage');
select ok(has_function_privilege('authenticated', 'private.is_active_member(uuid)', 'EXECUTE'), 'authenticated may execute RLS helper through policies');

select * from finish();
rollback;
