-- Photo support for testimonial slots (redesign to a photo-led carousel).
alter table public.testimonials
  add column if not exists photo_url text,
  add column if not exists photo_storage_id text;

-- Social-proof stat panel copy, admin-editable (never fabricated by app
-- code) -- shown beside the testimonials carousel. All nullable; the UI
-- hides the stat-number line entirely until an admin sets a real value.
alter table public.site_content
  add column if not exists testimonials_stat_number text,
  add column if not exists testimonials_tagline text,
  add column if not exists testimonials_hashtag text;

-- Storage bucket for testimonial photos, same public-read/admin-write
-- pattern as gallery-images/hero-images.
insert into storage.buckets (id, name, public)
values ('testimonial-photos', 'testimonial-photos', true)
on conflict (id) do nothing;

create policy "Public read access on testimonial photos"
  on storage.objects for select
  using (bucket_id = 'testimonial-photos');

create policy "Admins can upload testimonial photos"
  on storage.objects for insert
  with check (
    bucket_id = 'testimonial-photos'
    and exists (select 1 from admins where admins.auth_user_id = auth.uid())
  );

create policy "Admins can update testimonial photos"
  on storage.objects for update
  using (
    bucket_id = 'testimonial-photos'
    and exists (select 1 from admins where admins.auth_user_id = auth.uid())
  );

create policy "Admins can delete testimonial photos"
  on storage.objects for delete
  using (
    bucket_id = 'testimonial-photos'
    and exists (select 1 from admins where admins.auth_user_id = auth.uid())
  );
