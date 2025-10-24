import { useEffect } from "react";

// Hook: adds a beforeunload listener when isDirty is true.
// Modern browsers show a generic confirmation dialog. message may be ignored by some browsers.
export default function useUnsavedChanges(isDirty, message = "You have unsaved changes. Are you sure you want to leave?") {
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      // Standard way to trigger the confirmation dialog
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    if (isDirty) {
      window.addEventListener("beforeunload", handler);
    }

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [isDirty, message]);
}
