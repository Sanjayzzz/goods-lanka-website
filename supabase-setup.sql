-- =====================================================
-- GODS LANKA Admin Portal — Supabase Setup SQL
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- 1. ADMIN USERS TABLE
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client_admin' check (role in ('super_admin', 'client_admin')),
  created_at timestamptz default now()
);

-- 2. BOOKINGS TABLE
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  package_name text not null,
  travel_date date,
  guests integer default 1,
  full_name text not null,
  email text not null,
  phone text,
  country text,
  special_requests text,
  total_price numeric(10,2) default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

-- 3. ENQUIRIES TABLE
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz default now()
);

-- 4. PACKAGES TABLE
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  image text,
  duration text,
  group_size text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  rating numeric(3,1) default 4.8,
  review_count integer default 0,
  category text,
  highlights text[],
  included text[],
  active boolean default true,
  created_at timestamptz default now()
);

-- 5. ROW LEVEL SECURITY — allow authenticated users to read/write
alter table admin_users enable row level security;
alter table bookings enable row level security;
alter table enquiries enable row level security;
alter table packages enable row level security;

-- Admin users: only authenticated can read
create policy "Authenticated read admin_users" on admin_users for select using (auth.role() = 'authenticated');
create policy "Authenticated update admin_users" on admin_users for update using (auth.role() = 'authenticated');

-- Bookings: authenticated can read/update/delete; anon can insert (from booking form)
create policy "Anon insert bookings" on bookings for insert with check (true);
create policy "Authenticated read bookings" on bookings for select using (auth.role() = 'authenticated');
create policy "Authenticated update bookings" on bookings for update using (auth.role() = 'authenticated');
create policy "Authenticated delete bookings" on bookings for delete using (auth.role() = 'authenticated');

-- Enquiries: anon can insert (from contact form); authenticated can read/update
create policy "Anon insert enquiries" on enquiries for insert with check (true);
create policy "Authenticated read enquiries" on enquiries for select using (auth.role() = 'authenticated');
create policy "Authenticated update enquiries" on enquiries for update using (auth.role() = 'authenticated');

-- Packages: anon can read active; authenticated can do everything
create policy "Anon read active packages" on packages for select using (active = true or auth.role() = 'authenticated');
create policy "Authenticated insert packages" on packages for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update packages" on packages for update using (auth.role() = 'authenticated');

-- 6. SEED PACKAGES DATA
insert into packages (name, slug, tagline, description, image, duration, group_size, price, original_price, category, highlights, included, active) values
(
  'Cultural Triangle Explorer', 'cultural-triangle-explorer', 'Uncover Ancient Kingdoms',
  'Journey through Sri Lanka''s ancient cities — from the rock fortress of Sigiriya to the sacred city of Kandy.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '7 Days / 6 Nights', '2-12 People', 899, 1199, 'Cultural',
  ARRAY['Sigiriya Rock Fortress', 'Temple of the Tooth', 'Dambulla Cave Temple', 'Polonnaruwa Ruins'],
  ARRAY['Airport transfers', 'Accommodation', 'Breakfast & dinner', 'English-speaking guide', 'Entrance fees'], true
),
(
  'Tropical Beach Escape', 'tropical-beach-escape', 'Sun, Sand & Serenity',
  'Relax on Sri Lanka''s most pristine beaches. From Mirissa to Galle, enjoy luxury relaxation.',
  'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80',
  '5 Days / 4 Nights', '2-8 People', 649, 849, 'Beach',
  ARRAY['Mirissa Beach', 'Whale Watching', 'Galle Fort Tour', 'Bentota Water Sports'],
  ARRAY['Beach resort stay', 'Breakfast', 'Whale watching trip', 'Water sports session', 'Airport transfers'], true
),
(
  'Hill Country Adventure', 'hill-country-adventure', 'Misty Mountains & Tea Trails',
  'Traverse the breathtaking highlands of Sri Lanka. Trek through emerald tea plantations.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  '6 Days / 5 Nights', '2-10 People', 749, 999, 'Adventure',
  ARRAY['Ella Train Journey', 'Nine Arch Bridge', 'Little Adam''s Peak', 'Tea Plantation Tour'],
  ARRAY['Boutique hotel stays', 'Breakfast & lunch', 'Train tickets', 'Trekking guide'], true
),
(
  'Wildlife Safari Expedition', 'wildlife-safari-expedition', 'Into the Wild',
  'Embark on an extraordinary wildlife adventure. Track leopards in Yala, observe elephants.',
  'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
  '5 Days / 4 Nights', '2-6 People', 799, 1049, 'Wildlife',
  ARRAY['Yala Leopard Safari', 'Udawalawe Elephants', 'Bundala Bird Sanctuary', 'Night Safari'],
  ARRAY['Safari lodge stays', 'All meals', '4x4 jeep safaris', 'Park entrance fees', 'Expert naturalist guide'], true
),
(
  'Luxury Honeymoon Retreat', 'luxury-honeymoon-retreat', 'Romance in Paradise',
  'Private villas, candlelit beach dinners, couples spa treatments, and sunset cruises.',
  'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&q=80',
  '8 Days / 7 Nights', '2 People', 1499, 1999, 'Luxury',
  ARRAY['Private Villa Stay', 'Couples Spa', 'Beach Candlelit Dinner', 'Sunset Cruise'],
  ARRAY['5-star accommodation', 'All meals', 'Private chauffeur', 'Spa treatments', 'All excursions'], true
),
(
  'Complete Sri Lanka Discovery', 'complete-sri-lanka-discovery', 'The Ultimate Journey',
  'Experience everything Sri Lanka has to offer in one incredible 14-day journey.',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  '14 Days / 13 Nights', '2-12 People', 1899, 2499, 'Adventure',
  ARRAY['Sigiriya & Dambulla', 'Ella Train', 'Yala Safari', 'Mirissa Beaches', 'Galle Fort'],
  ARRAY['All accommodation', 'Daily breakfast & dinner', 'Expert guide', 'All entrance fees', 'Internal transport'], true
)
on conflict (slug) do nothing;

-- =====================================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Go to Authentication > Users > Add User
-- 2. Create yourself as admin
-- 3. Run the INSERT below (replace values):
-- =====================================================

-- INSERT INTO admin_users (id, email, full_name, role)
-- VALUES ('YOUR_AUTH_USER_UUID', 'your@email.com', 'Your Name', 'super_admin');

-- =====================================================
-- 6. REVIEWS TABLE (ADDED FOR TRAVELLER REVIEWS)
-- =====================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  package_slug text not null,
  author_name text not null,
  avatar_url text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table reviews enable row level security;

-- Create policies to allow public reading and inserting of reviews
drop policy if exists "Allow public read access to reviews" on reviews;
create policy "Allow public read access to reviews"
  on reviews for select
  using (true);

drop policy if exists "Allow public insert access to reviews" on reviews;
create policy "Allow public insert access to reviews"
  on reviews for insert
  with check (true);

-- =====================================================
-- 7. STORAGE BUCKET FOR AVATARS
-- =====================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

drop policy if exists "Users can upload their own avatars" on storage.objects;
create policy "Users can upload their own avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

drop policy if exists "Users can update their own avatars" on storage.objects;
create policy "Users can update their own avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );
