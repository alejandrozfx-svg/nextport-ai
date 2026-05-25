import { NextResponse } from "next/server";

const CHANNEL_ID = "UCOR1BeCED7UEr3bouqe50fg";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getTag(entry: string, tag: string) {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? decodeXml(match[1].trim()) : "";
}

function getAttr(entry: string, tag: string, attr: string) {
  const match = entry.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"[^>]*>`));
  return match ? decodeXml(match[1].trim()) : "";
}

export async function GET() {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 60 * 60 },
      headers: {
        "User-Agent": "Nextport AI Academy/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to fetch channel feed" }, { status: response.status });
    }

    const xml = await response.text();
    const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match) => match[1]);
    const videos = entries.map((entry) => {
      const videoId = getTag(entry, "yt:videoId");
      const url = getAttr(entry, "link", "href") || `https://www.youtube.com/watch?v=${videoId}`;

      return {
        id: videoId,
        title: getTag(entry, "title"),
        url,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: getAttr(entry, "media:thumbnail", "url"),
        publishedAt: getTag(entry, "published"),
        updatedAt: getTag(entry, "updated"),
        views: Number(getAttr(entry, "media:statistics", "views") || 0),
      };
    }).filter((video) => video.id);

    return NextResponse.json({
      channel: {
        id: CHANNEL_ID,
        title: getTag(xml, "title") || "Del Barco al Algoritmo con Diego Solorzano",
        url: `https://www.youtube.com/channel/${CHANNEL_ID}`,
        handleUrl: "https://www.youtube.com/@delbarcoalalgoritmo",
      },
      videos,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Trade vault feed error:", error);
    return NextResponse.json({ error: "Unable to load trade vault feed" }, { status: 500 });
  }
}
