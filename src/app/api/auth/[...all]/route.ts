import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

// Get allowed origins from environment or use defaults
const allowedOrigins = [
  "http://localhost:3000",
  "https://dev.affrev.co"
];

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  
  // Only allow requests from our allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true"
      }
    });
  }

  return new NextResponse(null, { status: 204 });
}

// Handle actual auth requests
export const { POST, GET } = toNextJsHandler(auth);
