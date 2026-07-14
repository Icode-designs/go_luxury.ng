-- Homepage "Kind Words" testimonials carousel: 5 fixed slots, same pattern
-- as gallery_images (seeded rows that are never inserted/deleted again,
-- only updated). Empty slots fall back to hardcoded placeholder copy in the
-- app layer (see lib/settings/getTestimonials.ts) so the carousel always has
-- content; admins replace placeholders one slot at a time from
-- /admin/reviews.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  slot_number integer not null unique check (slot_number >= 1 and slot_number <= 5),
  quote text,
  customer_name text,
  customer_location text,
  rating smallint check (rating is null or (rating >= 1 and rating <= 5)),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Public can view testimonials"
  on public.testimonials for select
  using (true);

create policy "Admins manage testimonials"
  on public.testimonials for all
  using (is_admin())
  with check (is_admin());

insert into public.testimonials (slot_number)
values (1), (2), (3), (4), (5)
on conflict (slot_number) do nothing;
