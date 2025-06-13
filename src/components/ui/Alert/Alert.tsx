import { useEffect } from "react";
import s from "./Alert.module.css";

interface AlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "error" | "success" | "warning" | "info";
}

export const Alert = ({
  message,
  isVisible,
  onClose,
  type = "error",
}: AlertProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${s.alert} ${s[type]}`}>
      <span className="material-symbols-outlined">
        {type === "error" && "error"}
        {type === "success" && "check_circle"}
        {type === "warning" && "warning"}
        {type === "info" && "info"}
      </span>
      <p>{message}</p>
      <button onClick={onClose} className={s.closeButton}>
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};
