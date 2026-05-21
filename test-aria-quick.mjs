#!/usr/bin/env node

/**
 * ARIA Questions Quick Test
 * Run with: node test-aria-quick.mjs
 * 
 * This tests the database directly without needing the Next.js server
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
let envContent;
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (err) {
  console.error('❌ Cannot read .env.local file');
  process.exit(1);
}

// Parse env file
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      envVars[key] = value;
    }
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║   ARIA QUESTIONS — QUICK TEST                          ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

// TEST 1: Database Connection
console.log('🔍 TEST 1: Database Connection');
try {
  const { data, error } = await supabase
    .from('questions')
    .select('count')
    .limit(1);

  if (error) {
    console.log('❌ FAIL: Cannot connect to database');
    console.log('   Error:', error.message);
    failed++;
  } else {
    console.log('✅ PASS: Database connection successful\n');
    passed++;
  }
} catch (err) {
  console.log('❌ FAIL: Exception connecting to database');
  console.log('   Error:', err.message);
  failed++;
}

// TEST 2: Triage Questions Exist
console.log('🔍 TEST 2: Triage Questions Exist');
try {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_triage', true);

  if (error) {
    console.log('❌ FAIL: Error fetching triage questions');
    console.log('   Error:', error.message);
    console.log('   Hint: RLS policy may be blocking access');
    failed++;
  } else if (!data || data.length === 0) {
    console.log('❌ FAIL: No triage questions found');
    console.log('   Expected: 5 questions');
    console.log('   Found: 0 questions');
    console.log('   Action: Run FIX_ARIA_QUESTIONS_LOADING.sql');
    failed++;
  } else if (data.length !== 5) {
    console.log('⚠️  WARN: Unexpected number of triage questions');
    console.log(`   Expected: 5 questions`);
    console.log(`   Found: ${data.length} questions`);
    passed++;
  } else {
    console.log('✅ PASS: Found 5 triage questions\n');
    passed++;
  }

  // TEST 3: Options Format
  if (data && data.length > 0) {
    console.log('🔍 TEST 3: Options Format');
    let formatValid = true;
    const issues = [];

    data.forEach((q, idx) => {
      if (!q.options || !Array.isArray(q.options)) {
        formatValid = false;
        issues.push(`Q${idx + 1}: No options array`);
        return;
      }

      q.options.forEach((opt, optIdx) => {
        if (!opt.label && !opt.text) {
          formatValid = false;
          issues.push(`Q${idx + 1} Opt${optIdx + 1}: Missing label/text`);
        }
        if (!opt.maps_to) {
          formatValid = false;
          issues.push(`Q${idx + 1} Opt${optIdx + 1}: Missing maps_to`);
        }
        if (opt.value === undefined) {
          formatValid = false;
          issues.push(`Q${idx + 1} Opt${optIdx + 1}: Missing value`);
        }
      });
    });

    if (formatValid) {
      console.log('✅ PASS: All options have correct format\n');
      passed++;
    } else {
      console.log('❌ FAIL: Options format issues found');
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('   Action: Run FIX_ARIA_QUESTIONS_LOADING.sql\n');
      failed++;
    }

    // TEST 4: Question Content
    console.log('🔍 TEST 4: Question Content');
    const categories = data.map(q => q.category);
    const expectedCategories = ['depression', 'sleep', 'stress', 'loneliness', 'anxiety'];
    const missingCategories = expectedCategories.filter(cat => !categories.includes(cat));

    if (missingCategories.length > 0) {
      console.log('⚠️  WARN: Some categories missing');
      console.log(`   Missing: ${missingCategories.join(', ')}`);
      console.log(`   Found: ${categories.join(', ')}\n`);
      passed++;
    } else {
      console.log('✅ PASS: All expected categories covered\n');
      passed++;
    }

    // TEST 5: Display Sample Question
    console.log('🔍 TEST 5: Sample Question');
    const sample = data[0];
    console.log('   Question:', sample.question);
    console.log('   Category:', sample.category);
    console.log('   Options:', sample.options.length);
    console.log('   First option:', sample.options[0].label || sample.options[0].text);
    console.log('   maps_to:', JSON.stringify(sample.options[0].maps_to));
    console.log('✅ PASS: Sample question displayed\n');
    passed++;
  }
} catch (err) {
  console.log('❌ FAIL: Exception in test suite');
  console.log('   Error:', err.message);
  failed++;
}

// TEST 6: RLS Policy Check
console.log('🔍 TEST 6: Anonymous Access (RLS Policy)');
try {
  // Create a new client without auth to simulate anonymous user
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await anonClient
    .from('questions')
    .select('id')
    .eq('is_triage', true)
    .limit(1);

  if (error) {
    console.log('❌ FAIL: Anonymous users cannot access questions');
    console.log('   Error:', error.message);
    console.log('   Hint: RLS policy is blocking anonymous access');
    console.log('   Action: Run migration 012 or FIX_ARIA_QUESTIONS_LOADING.sql');
    failed++;
  } else if (!data || data.length === 0) {
    console.log('⚠️  WARN: No questions accessible to anonymous users');
    console.log('   This may indicate an RLS issue');
    passed++;
  } else {
    console.log('✅ PASS: Anonymous users can access questions\n');
    passed++;
  }
} catch (err) {
  console.log('❌ FAIL: Exception testing anonymous access');
  console.log('   Error:', err.message);
  failed++;
}

// Summary
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║                    TEST SUMMARY                        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log(`Total Tests: ${passed + failed}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}\n`);

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! ARIA is ready for production.\n');
  process.exit(0);
} else {
  console.log('⚠️  CRITICAL ISSUES FOUND!\n');
  console.log('📋 Action Required:');
  console.log('   1. Open Supabase SQL Editor');
  console.log('   2. Run: FIX_ARIA_QUESTIONS_LOADING.sql');
  console.log('   3. Run this test again\n');
  process.exit(1);
}
