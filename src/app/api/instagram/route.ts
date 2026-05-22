import { NextResponse } from "next/server";

export const revalidate = 3600; // re-fetch cada hora

export interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "INSTAGRAM_ACCESS_TOKEN no configurado" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media` +
        `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
        `&limit=8` +
        `&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Instagram API error:", err);
      return NextResponse.json({ error: "Error al obtener posts" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Instagram fetch failed:", err);
    return NextResponse.json({ error: "Error de red" }, { status: 500 });
  }
}
