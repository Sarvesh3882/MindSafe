import { buildWellnessSummary } from './src/lib/aria/insights';

console.log('Testing if tips vary by SEVERITY and CONDITION:\n');
console.log('='.repeat(70));

// Test 1: Low severity anxiety
console.log('\n1. LOW SEVERITY ANXIETY (score: 5/21 = 24%)');
const low = buildWellnessSummary('anxiety', false, { depression: 3, anxiety: 5, stress: 8, sleep: 4, burnout: 15, loneliness: 12, substance: 0 });
console.log('Headline:', low.headline);
console.log('Section:', low.sectionHeading);
console.log('Tips:');
low.tips.forEach((t, i) => console.log(`  ${i+1}. [${t.severity}] ${t.text.substring(0, 60)}...`));

// Test 2: Moderate severity anxiety
console.log('\n2. MODERATE SEVERITY ANXIETY (score: 12/21 = 57%)');
const mod = buildWellnessSummary('anxiety', false, { depression: 5, anxiety: 12, stress: 14, sleep: 6, burnout: 25, loneliness: 18, substance: 0 });
console.log('Headline:', mod.headline);
console.log('Section:', mod.sectionHeading);
console.log('Tips:');
mod.tips.forEach((t, i) => console.log(`  ${i+1}. [${t.severity}] ${t.text.substring(0, 60)}...`));

// Test 3: High severity anxiety
console.log('\n3. HIGH SEVERITY ANXIETY (score: 18/21 = 86%)');
const high = buildWellnessSummary('anxiety', false, { depression: 8, anxiety: 18, stress: 16, sleep: 10, burnout: 40, loneliness: 22, substance: 0 });
console.log('Headline:', high.headline);
console.log('Section:', high.sectionHeading);
console.log('Tips:');
high.tips.forEach((t, i) => console.log(`  ${i+1}. [${t.severity}] ${t.text.substring(0, 60)}...`));

// Test 4: Different condition - Depression
console.log('\n4. MODERATE SEVERITY DEPRESSION (score: 12/27 = 44%)');
const dep = buildWellnessSummary('depression', false, { depression: 12, anxiety: 5, stress: 10, sleep: 6, burnout: 20, loneliness: 15, substance: 0 });
console.log('Headline:', dep.headline);
console.log('Section:', dep.sectionHeading);
console.log('Tips:');
dep.tips.forEach((t, i) => console.log(`  ${i+1}. [${t.severity}] ${t.text.substring(0, 60)}...`));

// Test 5: Different condition - Stress
console.log('\n5. HIGH SEVERITY STRESS (score: 32/40 = 80%)');
const stress = buildWellnessSummary('stress', false, { depression: 8, anxiety: 7, stress: 32, sleep: 10, burnout: 40, loneliness: 20, substance: 0 });
console.log('Headline:', stress.headline);
console.log('Section:', stress.sectionHeading);
console.log('Tips:');
stress.tips.forEach((t, i) => console.log(`  ${i+1}. [${t.severity}] ${t.text.substring(0, 60)}...`));

// Test 6: Multi-domain (high stress + moderate anxiety)
console.log('\n6. MULTI-DOMAIN: High Stress + Moderate Anxiety');
const multi = buildWellnessSummary('stress', false, { depression: 6, anxiety: 12, stress: 30, sleep: 8, burnout: 35, loneliness: 18, substance: 0 });
console.log('Headline:', multi.headline);
console.log('Section:', multi.sectionHeading);
console.log('Tips (should mix stress + anxiety):');
multi.tips.forEach((t, i) => console.log(`  ${i+1}. [${t.severity}] ${t.text.substring(0, 60)}...`));

console.log('\n' + '='.repeat(70));
console.log('ANALYSIS:');
console.log('✓ Do tips match severity? Check [low/moderate/high] tags');
console.log('✓ Do tips differ by condition? Compare anxiety vs depression vs stress');
console.log('✓ Are techniques appropriate? Low=self-help, High=professional support');
console.log('✓ Multi-domain mixing? Last test should show mixed tips');
