import { NextResponse } from "next/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";

const client = new ImageAnnotatorClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "이미지를 찾을 수 없어요." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const [result] = await client.annotateImage({
      image: { content: buffer },
      features: [
        { type: "LABEL_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
        { type: "IMAGE_PROPERTIES" },
        { type: "WEB_DETECTION" },
      ],
    });

    const labels =
      result.labelAnnotations?.slice(0, 5).map(l => l.description) ?? [];

    const objects =
      result.localizedObjectAnnotations
        ?.slice(0, 5)
        .map(o => o.name) ?? [];

    const colors =
      result.imagePropertiesAnnotation?.dominantColors?.colors
        ?.slice(0, 3)
        .map(c => {
          const r = Math.round(c.color?.red ?? 0);
          const g = Math.round(c.color?.green ?? 0);
          const b = Math.round(c.color?.blue ?? 0);
          return `rgb(${r},${g},${b})`;
        }) ?? [];

    const webEntities =
      result.webDetection?.webEntities
        ?.filter(e => e.score && e.score > 0.5)
        .slice(0, 5)
        .map(e => e.description) ?? [];

    return NextResponse.json({
      labels,
      objects,
      colors,
      webEntities,
    });
  } catch (error) {
    console.error("VISION ERROR:", error);
    return NextResponse.json(
      { error: "사진 분석 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
