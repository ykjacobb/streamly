import { updateStreamersStatus } from "@/lib/actions/streamer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        // Verify cron secret if needed
        const authHeader = request.headers.get("authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await updateStreamersStatus();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating streamers status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
