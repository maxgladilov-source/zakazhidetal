"use client";
import { useState, useEffect } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onComplete(); }, 800);
    return () => clearTimeout(t);
  }, [onComplete]);
  if (!visible) return null;
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", zIndex: 9999 }}>
      <span style={{ fontSize: 24, fontWeight: 600 }}>ЗакажиДеталь</span>
    </div>
  );
}
