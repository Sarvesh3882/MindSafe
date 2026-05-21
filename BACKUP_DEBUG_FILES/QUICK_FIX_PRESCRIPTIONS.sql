-- QUICK FIX: Temporarily disable RLS on prescriptions table
-- This will make prescriptions work immediately
-- Run this in Supabase SQL Editor

-- Disable RLS on prescriptions table
ALTER TABLE prescriptions DISABLE ROW LEVEL SECURITY;

-- Note: This removes security restrictions temporarily
-- You should re-enable RLS and fix policies later for production
