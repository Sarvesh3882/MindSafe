/**
 * Clear Today's Check-ins - Testing Script
 * 
 * This script deletes all assessments created today for the current user,
 * allowing you to test the check-in flow multiple times per day.
 * 
 * Usage:
 *   node clear-todays-checkins.mjs
 * 
 * Or with specific user email:
 *   node clear-todays-checkins.mjs user@example.com
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function clearTodaysCheckins(userEmail) {
  console.log('🧹 Clearing Today\'s Check-ins...\n');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  console.log(`📅 Today's date: ${today}\n`);

  try {
    let userId;

    if (userEmail) {
      // Get user by email
      console.log(`🔍 Looking up user: ${userEmail}`);
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('email', userEmail)
        .limit(1);

      if (userError) throw userError;
      
      if (!users || users.length === 0) {
        console.error(`❌ User not found: ${userEmail}`);
        process.exit(1);
      }

      userId = users[0].id;
      console.log(`✅ Found user: ${users[0].email} (${users[0].role})\n`);
    } else {
      // Interactive: Show all users and let user choose
      console.log('📋 Fetching all users...\n');
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, role')
        .order('created_at', { ascending: false })
        .limit(20);

      if (userError) throw userError;

      if (!users || users.length === 0) {
        console.error('❌ No users found in database');
        process.exit(1);
      }

      console.log('Available users:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} - ${user.role}`);
      });

      console.log('\n💡 Tip: Run with email to skip selection:');
      console.log('   node clear-todays-checkins.mjs user@example.com\n');
      
      // For now, just use the first user (you can enhance this with readline for interactive selection)
      userId = users[0].id;
      console.log(`Using first user: ${users[0].email} (${users[0].role})\n`);
    }

    // Check for today's assessments
    console.log('🔍 Checking for today\'s assessments...');
    const { data: assessments, error: checkError } = await supabase
      .from('assessments')
      .select('id, emotion, risk_level, created_at')
      .eq('user_id', userId)
      .eq('date', today);

    if (checkError) throw checkError;

    if (!assessments || assessments.length === 0) {
      console.log('✅ No check-ins found for today. Nothing to delete.\n');
      return;
    }

    console.log(`\n📊 Found ${assessments.length} assessment(s) for today:`);
    assessments.forEach((assessment, index) => {
      const time = new Date(assessment.created_at).toLocaleTimeString();
      console.log(`  ${index + 1}. ${assessment.emotion || 'N/A'} - ${assessment.risk_level} (${time})`);
    });

    // Delete today's assessments
    console.log(`\n🗑️  Deleting ${assessments.length} assessment(s)...`);
    const { error: deleteError } = await supabase
      .from('assessments')
      .delete()
      .eq('user_id', userId)
      .eq('date', today);

    if (deleteError) throw deleteError;

    console.log('✅ Successfully deleted today\'s check-ins!\n');
    console.log('🎉 You can now test the check-in flow again.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Get user email from command line argument
const userEmail = process.argv[2];

clearTodaysCheckins(userEmail);
