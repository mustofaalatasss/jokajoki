import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    // Simple security check
    if (secret !== "jokajoki123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Spawn a detached process to pull, build, and restart
    // This allows the API to return immediately before the server restarts itself
    const child = spawn(
      "sh",
      ["-c", "git pull origin main && npm install && npm run build && pm2 restart all"],
      {
        detached: true,
        stdio: "ignore",
      }
    );

    // Unref the child so it runs independently in the background
    child.unref();

    return NextResponse.json({
      message: "Webhook received successfully! Server is now updating in the background.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
