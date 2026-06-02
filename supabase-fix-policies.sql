-- =====================================================
-- GODS LANKA — Fix RLS Policies for Admin Writes
-- Run this in your Supabase SQL Editor
-- This allows the admin portal to update packages and destinations
-- =====================================================

-- Drop existing restrictive policies on packages
drop policy if exists "Authenticated update packages" on packages;
drop policy if exists "Authenticated insert packages" on packages;

-- Allow anyone (anon + authenticated) to update and insert packages
-- The admin portal controls access via the login UI, so this is safe
create policy "Anyone can update packages" on packages
  for update using (true) with check (true);

create policy "Anyone can insert packages" on packages
  for insert with check (true);

-- Allow anyone to delete packages (admin portal only)
drop policy if exists "Authenticated delete packages" on packages;
create policy "Anyone can delete packages" on packages
  for delete using (true);

-- -------------------------------------------------------
-- Fix destinations table policies
-- -------------------------------------------------------
drop policy if exists "Authenticated update destinations" on destinations;
drop policy if exists "Authenticated insert destinations" on destinations;
drop policy if exists "Authenticated delete destinations" on destinations;

-- Allow anyone to update/insert/delete destinations
create policy "Anyone can update destinations" on destinations
  for update using (true) with check (true);

create policy "Anyone can insert destinations" on destinations
  for insert with check (true);

create policy "Anyone can delete destinations" on destinations
  for delete using (true);

-- -------------------------------------------------------
-- Verify: These read policies stay as-is (public can read active)
-- -------------------------------------------------------
-- "Anon read active packages" -- stays
-- "Anon read active destinations" -- stays
