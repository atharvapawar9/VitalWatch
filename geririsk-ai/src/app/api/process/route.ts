import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { parseCSVString } from "@/lib/csvParser";
import { preprocessData } from "@/lib/preprocess";
import { calculateDatasetAggregates } from "@/lib/features";

export async function GET() {
  try {
    // Get latest uploaded file
    const { data: uploads, error } = await supabase
      .from("uploads")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .limit(1);

    if (error || !uploads || uploads.length === 0) {
      return NextResponse.json({ error: "No uploads found" }, { status: 400 });
    }

    const filePath = uploads[0].file_path;

    // Download CSV from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("wearable-uploads")
      .download(filePath);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: "Failed to download file" },
        { status: 500 }
      );
    }

    // Convert blob to string
    const csvString = await fileData.text();

    // Parse CSV string
    const parseResult = parseCSVString(csvString);

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: "CSV parsing errors", details: parseResult.errors },
        { status: 400 }
      );
    }

    // Preprocess data
    const preprocessResult = preprocessData(parseResult.data, {
      removeNulls: true,
      trimStrings: true,
      normalizeKeys: true,
    });

    // Calculate dataset-level aggregates
    const aggregates = calculateDatasetAggregates(preprocessResult.data);

    return NextResponse.json({
      file: filePath,
      recordCount: preprocessResult.processed,
      skipped: preprocessResult.skipped,
      aggregates,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
