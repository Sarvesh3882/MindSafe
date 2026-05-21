"use client";

/**
 * ARIA Questions Test Page
 * Browser-based test interface for verifying ARIA questions loading
 * Access at: /test-aria
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchTriageQuestions,
  fetchInstrumentQuestions,
  fetchCamouflageQuestions,
} from "@/app/student/checkin/api";
import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  INSTRUMENT_CONFIGS,
} from "@/lib/aria/engine";

interface TestResult {
  test: string;
  status: "PASS" | "FAIL" | "WARN" | "RUNNING";
  message: string;
  details?: any;
}

export default function TestARIAPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<{
    passed: number;
    failed: number;
    warned: number;
  } | null>(null);

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const runTests = async () => {
    setResults([]);
    setSummary(null);
    setRunning(true);

    try {
      // TEST 1: Database Access
      addResult({
        test: "1. Database Access",
        status: "RUNNING",
        message: "Testing database connection...",
      });

      const supabase = createClient();
      const { data: dbData, error: dbError } = await supabase
        .from("questions")
        .select("*")
        .eq("is_triage", true);

      if (dbError) {
        addResult({
          test: "1. Database Access",
          status: "FAIL",
          message: "Cannot access questions table",
          details: dbError,
        });
      } else if (!dbData || dbData.length === 0) {
        addResult({
          test: "1. Database Access",
          status: "FAIL",
          message: "No triage questions found in database",
          details: { count: 0 },
        });
      } else {
        addResult({
          test: "1. Database Access",
          status: "PASS",
          message: `Found ${dbData.length} triage questions`,
          details: { count: dbData.length },
        });
      }

      // TEST 2: API Layer
      addResult({
        test: "2. API Layer",
        status: "RUNNING",
        message: "Testing fetchTriageQuestions API...",
      });

      const triageQuestions = await fetchTriageQuestions();

      if (!triageQuestions || triageQuestions.length === 0) {
        addResult({
          test: "2. API Layer",
          status: "FAIL",
          message: "API returned no triage questions",
          details: { returned: triageQuestions },
        });
      } else {
        addResult({
          test: "2. API Layer",
          status: "PASS",
          message: `API returned ${triageQuestions.length} questions`,
          details: { count: triageQuestions.length },
        });
      }

      // TEST 3: Options Format
      addResult({
        test: "3. Options Format",
        status: "RUNNING",
        message: "Validating options structure...",
      });

      let formatValid = true;
      const formatIssues: string[] = [];

      triageQuestions.forEach((q: any, idx: number) => {
        if (!q.options || !Array.isArray(q.options)) {
          formatValid = false;
          formatIssues.push(`Q${idx + 1}: No options array`);
          return;
        }

        q.options.forEach((opt: any, optIdx: number) => {
          if (!opt.label) {
            formatValid = false;
            formatIssues.push(`Q${idx + 1} Opt${optIdx + 1}: Missing label`);
          }
          if (!opt.maps_to) {
            formatValid = false;
            formatIssues.push(`Q${idx + 1} Opt${optIdx + 1}: Missing maps_to`);
          }
        });
      });

      if (formatValid) {
        addResult({
          test: "3. Options Format",
          status: "PASS",
          message: "All options have correct format",
        });
      } else {
        addResult({
          test: "3. Options Format",
          status: "FAIL",
          message: "Options format issues found",
          details: formatIssues,
        });
      }

      // TEST 4: ARIA Engine
      addResult({
        test: "4. ARIA Engine",
        status: "RUNNING",
        message: "Testing triage signal computation...",
      });

      try {
        const mockAnswers = triageQuestions.slice(0, 5).map((q: any, idx: number) => ({
          questionId: q.id,
          value: idx % 2 === 0 ? 2 : 1,
          mapsTo: q.options[idx % 2 === 0 ? 2 : 1]?.maps_to || {},
        }));

        const signal = computeTriageSignal(mockAnswers);
        const escalate = shouldEscalate(signal);
        const queue = buildAssessmentQueue(signal);

        addResult({
          test: "4. ARIA Engine",
          status: "PASS",
          message: `Engine working: ${escalate ? "ESCALATE" : "STABLE"}`,
          details: { signal, queue },
        });
      } catch (err) {
        addResult({
          test: "4. ARIA Engine",
          status: "FAIL",
          message: "Engine computation failed",
          details: err,
        });
      }

      // TEST 5: Question Content
      addResult({
        test: "5. Question Content",
        status: "RUNNING",
        message: "Validating question content...",
      });

      const expectedCategories = ["depression", "sleep", "stress", "loneliness", "anxiety"];
      const foundCategories = triageQuestions.map((q: any) => q.category);
      const missingCategories = expectedCategories.filter(
        (cat) => !foundCategories.includes(cat)
      );

      if (missingCategories.length > 0) {
        addResult({
          test: "5. Question Content",
          status: "WARN",
          message: `Missing categories: ${missingCategories.join(", ")}`,
          details: { found: foundCategories, missing: missingCategories },
        });
      } else {
        addResult({
          test: "5. Question Content",
          status: "PASS",
          message: "All expected categories covered",
        });
      }

      // TEST 6: RLS Policy
      addResult({
        test: "6. RLS Policy",
        status: "RUNNING",
        message: "Testing anonymous access...",
      });

      // This test checks if the current client (which may be anonymous) can access questions
      const { data: rlsData, error: rlsError } = await supabase
        .from("questions")
        .select("id")
        .eq("is_triage", true)
        .limit(1);

      if (rlsError) {
        addResult({
          test: "6. RLS Policy",
          status: "FAIL",
          message: "RLS blocking access (run migration 012)",
          details: rlsError,
        });
      } else if (!rlsData || rlsData.length === 0) {
        addResult({
          test: "6. RLS Policy",
          status: "WARN",
          message: "No questions accessible (possible RLS issue)",
        });
      } else {
        addResult({
          test: "6. RLS Policy",
          status: "PASS",
          message: "Questions accessible",
        });
      }

      // Calculate summary
      const finalResults = results.filter((r) => r.status !== "RUNNING");
      const passed = finalResults.filter((r) => r.status === "PASS").length;
      const failed = finalResults.filter((r) => r.status === "FAIL").length;
      const warned = finalResults.filter((r) => r.status === "WARN").length;

      setSummary({ passed, failed, warned });
    } catch (err) {
      addResult({
        test: "Test Suite",
        status: "FAIL",
        message: "Test suite crashed",
        details: err,
      });
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    // Auto-run tests on page load
    runTests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
        return "text-green-600 bg-green-50";
      case "FAIL":
        return "text-red-600 bg-red-50";
      case "WARN":
        return "text-yellow-600 bg-yellow-50";
      case "RUNNING":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "PASS":
        return "✅";
      case "FAIL":
        return "❌";
      case "WARN":
        return "⚠️";
      case "RUNNING":
        return "⏳";
      default:
        return "❓";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ARIA Questions Test Suite
          </h1>
          <p className="text-gray-600">
            Comprehensive testing for ARIA triage questions loading and functionality
          </p>
        </div>

        {/* Summary */}
        {summary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {summary.passed}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">
                  {summary.failed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {summary.warned}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>

            {summary.failed > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ❌ Critical issues found! Run FIX_ARIA_QUESTIONS_LOADING.sql
                </p>
              </div>
            )}

            {summary.failed === 0 && summary.warned === 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✅ All tests passed! ARIA is ready for production.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={runTests}
              disabled={running}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {running ? "Running..." : "Run Tests Again"}
            </button>
          </div>

          <div className="space-y-3">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getStatusEmoji(result.status)}</span>
                      <span className="font-semibold">{result.test}</span>
                    </div>
                    <p className="text-sm ml-7">{result.message}</p>
                    {result.details && (
                      <details className="mt-2 ml-7">
                        <summary className="text-xs cursor-pointer text-gray-600 hover:text-gray-800">
                          Show details
                        </summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && !running && (
              <div className="text-center text-gray-500 py-8">
                Click "Run Tests Again" to start testing
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📋 What This Tests
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Database access to questions table</li>
            <li>Triage questions existence and count</li>
            <li>Options format (label, maps_to structure)</li>
            <li>ARIA engine computation (signal, escalation, queue)</li>
            <li>Question content coverage (all domains)</li>
            <li>RLS policy (anonymous access)</li>
          </ul>

          <h3 className="font-semibold text-blue-900 mt-4 mb-2">
            🔧 If Tests Fail
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Open Supabase SQL Editor</li>
            <li>Run: <code className="bg-blue-100 px-1 rounded">FIX_ARIA_QUESTIONS_LOADING.sql</code></li>
            <li>Refresh this page and run tests again</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
