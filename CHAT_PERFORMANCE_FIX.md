# Chat Performance Fix - Slow Response Issue

## Problem
Chatbot (Saathi) is taking a very long time to respond, causing poor user experience with extended loading states.

## Root Cause Analysis
The slow response is likely caused by:
1. **Mistral API latency** - External API calls can take 5-30 seconds depending on:
   - Network conditions
   - Mistral server load
   - Agent complexity
   - Message history length

2. **No timeout protection** - Previous implementation had no timeout, causing indefinite waiting

3. **Lack of visibility** - No logging to diagnose where time is being spent

## Solutions Applied

### 1. Added 30-Second Timeout ✅
**File:** `src/lib/mistral/chat.ts`

Added timeout wrapper to prevent indefinite hanging:
```typescript
// Add timeout wrapper to prevent indefinite hanging (30 second timeout)
const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(() => reject(new Error("Mistral API timeout after 30 seconds")), 30000);
});

const apiPromise = client.agents.complete({
  agentId,
  messages,
});

const response = await Promise.race([apiPromise, timeoutPromise]);
```

**Benefits:**
- Prevents indefinite waiting
- Returns error message after 30 seconds
- User gets feedback instead of infinite loading

### 2. Added Performance Logging ✅
**File:** `src/app/api/chat/route.ts`

Added detailed logging to track performance:
```typescript
console.log("[Chat API] Calling Mistral API...");
const mistralStart = Date.now();

const reply = await sendChatMessage(history ?? [], message, saathiContext);

const mistralDuration = ((Date.now() - mistralStart) / 1000).toFixed(2);
console.log(`[Chat API] Mistral API responded in ${mistralDuration}s`);
```

**Benefits:**
- Track exact time spent on Mistral API
- Identify bottlenecks
- Monitor performance over time

### 3. Created Diagnostic Test Script ✅
**File:** `test-mistral-api.mjs`

Run this to test Mistral API directly:
```bash
node test-mistral-api.mjs
```

**What it tests:**
- API key validity
- Agent ID configuration
- Response time
- Response format
- Error handling

## How to Diagnose Slow Responses

### Step 1: Check Server Logs
Look for these log messages in your terminal where Next.js is running:
```
[Chat API] Received message: "..."
[Chat API] Calling Mistral API...
[Chat API] Mistral API responded in X.XXs
[Chat API] Total request time: X.XXs
```

### Step 2: Run Diagnostic Test
```bash
cd mindsafe-india
node test-mistral-api.mjs
```

Expected output:
```
✅ Response received in X.XX seconds
📝 Response: [Saathi's response]
✅ Mistral API is working correctly!
```

If response time > 5 seconds, you'll see:
```
⚠️  WARNING: Response took longer than 5 seconds
This could cause timeout issues in production
```

### Step 3: Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message in chat
4. Look for `/api/chat` request
5. Check timing breakdown

## Performance Expectations

### Normal Performance:
- **Mistral API:** 2-5 seconds
- **Total request:** 2-6 seconds
- **User experience:** Acceptable

### Slow Performance:
- **Mistral API:** 10-30 seconds
- **Total request:** 10-30 seconds
- **User experience:** Poor (but now has timeout)

### Timeout:
- **After 30 seconds:** Error message returned
- **User sees:** "I'm having a little trouble right now. Please try again in a moment 💙"

## Possible Causes of Slow Responses

### 1. Mistral API Server Load
**Symptom:** Consistently slow (10+ seconds)
**Solution:** 
- Contact Mistral support
- Consider upgrading API tier
- Implement caching for common responses

### 2. Network Issues
**Symptom:** Intermittent slowness
**Solution:**
- Check internet connection
- Test from different network
- Check firewall/proxy settings

### 3. Large Message History
**Symptom:** Slower with longer conversations
**Solution:** Already implemented - history limited to last 10 turns
```typescript
const recentHistory = history.slice(-10);
```

### 4. Complex Context
**Symptom:** Slower when user has many assessments
**Solution:** Already optimized - only fetches last 7 days
```typescript
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
```

## Optimization Recommendations

### Short-term (Already Implemented):
- ✅ 30-second timeout
- ✅ Performance logging
- ✅ Limited message history (10 turns)
- ✅ Limited assessment context (7 days)

### Medium-term (Future Improvements):
- [ ] Add loading progress indicator (e.g., "Thinking...", "Almost there...")
- [ ] Implement response streaming for faster perceived performance
- [ ] Add retry logic with exponential backoff
- [ ] Cache common responses

### Long-term (Architecture):
- [ ] Consider alternative AI providers as fallback
- [ ] Implement response caching layer
- [ ] Add CDN for static assets
- [ ] Optimize database queries

## Testing Instructions

### 1. Test Normal Flow:
1. Open chat page
2. Send message: "Hi, I'm feeling stressed"
3. Check server logs for timing
4. Verify response appears within 5-10 seconds

### 2. Test Timeout:
To simulate timeout (for testing only):
- Temporarily change timeout to 1 second in `chat.ts`
- Send a message
- Should see error message after 1 second
- Restore to 30 seconds after testing

### 3. Test Error Handling:
1. Temporarily break API key in `.env.local`
2. Send a message
3. Should see error message immediately
4. Restore correct API key

## Monitoring in Production

### Key Metrics to Track:
1. **Average response time** - Should be < 5 seconds
2. **Timeout rate** - Should be < 1%
3. **Error rate** - Should be < 0.1%
4. **User satisfaction** - Collect feedback

### Log Analysis:
Search logs for:
- `[Chat API] Mistral API responded in` - Track response times
- `Mistral API timeout` - Count timeout occurrences
- `Saathi chat error` - Count errors

## Status: IMPROVED ✅

The chat now has:
- ✅ 30-second timeout protection
- ✅ Detailed performance logging
- ✅ Diagnostic test script
- ✅ Better error handling
- ✅ Optimized message history
- ✅ Optimized context building

**Note:** The Mistral API response time is external and cannot be fully controlled. The improvements ensure the system fails gracefully and provides visibility into performance issues.
