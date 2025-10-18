import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const file = form.get("file") as unknown as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Validate size (<= 10MB)
    const MAX = 10 * 1024 * 1024;
    if ((file as any).size && (file as any).size > MAX) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Prepare storage directory
    const uploadDir = path.join(process.cwd(), "uploads", "prescriptions");
    await fs.mkdir(uploadDir, { recursive: true });

    // Derive filename
    const orig = (file as any).name || "prescription";
    const ext = orig.includes(".") ? orig.split(".").pop() : "bin";
    const safeName = `${Date.now()}_${(name || "patient").replace(/[^a-z0-9_-]/gi, "_")}.${ext}`;
    const filePath = path.join(uploadDir, safeName);

    // Persist file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Persist metadata (simple JSON log)
    const meta = {
      storedAt: new Date().toISOString(),
      filename: safeName,
      originalName: orig,
      size: (file as any).size || buffer.length,
      name,
      phone,
      email,
      notes,
    };
    const logPath = path.join(uploadDir, "submissions.jsonl");
    await fs.appendFile(logPath, JSON.stringify(meta) + "\n", "utf8");

    // In a production system, you would notify staff via email/Slack/DB here.

    return NextResponse.json({ ok: true, file: safeName });
  } catch (err: any) {
    console.error("Prescription upload failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
