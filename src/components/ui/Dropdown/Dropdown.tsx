import { useState, type ReactNode } from "react";
import styles from "./Dropdown.module.css";

interface DropdownProps {
  title: string;
  children?: ReactNode;
  options?: string[];
}

export const Dropdown = ({ title, options, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.dropdownHeader}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span className="material-symbols-outlined">
          {open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        </span>
      </div>
      {open && (
        <div>
          {children ? (
            children
          ) : (
            <ul className={styles.dropdownList}>
              {options?.map((opt) => (
                <li key={opt}>{opt}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
