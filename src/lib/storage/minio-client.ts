// Client-side safe functions for asset URLs
// This file doesn't import MinIO directly

export async function getAssetUrl(
  key: string | null | undefined,
  options: {
    fallback?: string;
    expiry?: number;
    transform?: { width?: number; height?: number; quality?: number };
  } = {}
): Promise<string> {
  if (!key) {
    return options.fallback || "/placeholder.jpg";
  }

  try {
    // Call API to get signed URL
    const params = new URLSearchParams({
      key,
      ...(options.expiry && { expiry: options.expiry.toString() }),
    });
    
    const response = await fetch(`/api/assets/serve?${params}`);
    
    if (!response.ok) {
      throw new Error("Failed to get asset URL");
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error(`Failed to get asset URL for ${key}:`, error);
    return options.fallback || "/placeholder.jpg";
  }
}

// Helper to determine asset type from filename
export function getAssetType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  const typeMap: Record<string, string> = {
    // Images
    jpg: "images",
    jpeg: "images",
    png: "images",
    gif: "images",
    webp: "images",
    svg: "images",
    
    // Videos
    mp4: "videos",
    webm: "videos",
    mov: "videos",
    avi: "videos",
    
    // Audio
    mp3: "audio",
    wav: "audio",
    ogg: "audio",
    m4a: "audio",
    
    // Documents
    pdf: "documents",
    doc: "documents",
    docx: "documents",
    ppt: "documents",
    pptx: "documents",
    xls: "documents",
    xlsx: "documents",
    
    // Default
    default: "general",
  };
  
  return typeMap[ext || ""] || typeMap.default;
}
