"use client";
export default function ModelPreview({ modelUrl }: { modelUrl?: string }) {
  if (!modelUrl) return null;
  return (
    <div style={{ padding: 16, border: "1px dashed #ccc", borderRadius: 8, textAlign: "center", color: "#888" }}>
      3D Model: {modelUrl.split("/").pop()}
    </div>
  );
}
