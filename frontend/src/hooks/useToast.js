// src/hooks/useToast.js
import { useState, useRef, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "ok", visible: false });
  const timer = useRef(null);

  const show = useCallback((msg, type = "ok") => {
    clearTimeout(timer.current);
    setToast({ msg, type, visible: true });
    timer.current = setTimeout(
      () => setToast(t => ({ ...t, visible: false })),
      3500
    );
  }, []);

  return { toast, showToast: show };
}
