import { useState, type ReactNode } from "react";
import styles from "./Dropdown.module.css";

interface DropdownProps {
  title: string;
  children?: ReactNode;
  options?: string[];
  onSelect?: (option: string | null) => void;
  selectedOption?: string | null;
}

export const Dropdown = ({
  title,
  options,
  children,
  onSelect,
  selectedOption,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    if (onSelect) {
      if (selectedOption === option) {
        onSelect(null);
      } else {
        onSelect(option);
      }
    }
  };

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
                <li
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  className={`${styles.dropdownItem} ${
                    selectedOption === opt ? styles.selected : ""
                  }`}
                >
                  {opt}
                  {selectedOption === opt && (
                    <span className="material-symbols-outlined">check</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
