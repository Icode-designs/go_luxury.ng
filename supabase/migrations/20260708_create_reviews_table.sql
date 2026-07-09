-- Reviews table for product reviews (view + add), with moderation queue.
-- Run this in the Supabase SQL editor (or via `supabase db push` if you
-- adopt the CLI) before the reviews feature will work — the app code
-- assumes this table exists and cannot create it itself.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text,
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- One review per customer per product — resubmitting edits the existing
-- review (see the upsert in lib/reviews/submitReview.ts) instead of
-- creating duplicates.
create unique index if not exists reviews_product_customer_unique
  on reviews (product_id, customer_id);

create index if not exists reviews_product_status_idx
  on reviews (product_id, status);

alter table reviews enable row level security;

-- Public (anon) can only ever read approved reviews. This is the actual
-- security boundary — the app's own "status = active" filters in code are
-- not sufficient on their own, since the anon key is public and anyone can
-- query Supabase directly with it.
create policy "Public can read approved reviews"
  on reviews for select
  using (status = 'approved');

-- No public INSERT/UPDATE/DELETE policy is defined intentionally. All
-- writes go through submitReview's Server Action using the service-role
-- client, after honeypot/auth/validation/rate-limit checks. If you later
-- want customers to write directly from the browser, add a scoped INSERT
-- policy keyed to auth.uid() rather than relaxing this table wide open.
