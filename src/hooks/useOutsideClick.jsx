import { useEffect } from "react";

/**
 * @param {React.RefObject} ref - ref of the modal container
 * @param {Function} onClose - callback to close the modal
 * @param {boolean} enabled - optional flag to enable/disable listener
 */
const useOutsideClick = (ref, onClose, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose?.();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, onClose, enabled]);
};

export default useOutsideClick;
