/**
 * Keep-Alive Endpoint
 * Prevents Supabase free tier from pausing due to inactivity
 * Called weekly by GitHub Actions cron job
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Simple query to keep database active
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json(
        { 
          status: "error", 
          message: error.message,
          timestamp: new Date().toISOString() 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "alive",
      message: "Database is active",
      timestamp: new Date().toISOString(),
      queryResult: data ? "success" : "no data"
    });
  } catch (err) {
    console.error("Keep-alive error:", err);
    return NextResponse.json(
      { 
        status: "error", 
        message: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}
