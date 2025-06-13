import { useState, type ReactNode } from "react";
import styles from "./Dropdown.module.css";

interface DropdownProps {
  title: string;
  children?: ReactNode;
  options?: string[];
  onSelect?: (option: string | null) => void;
  selectedOption?: string | null;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const Dropdown = ({
  title,
  children,
  options,
  onSelect,
  selectedOption,
  isOpen: controlledIsOpen,
  onToggle,
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

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : open;
  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isOpen);
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownHeader} onClick={handleToggle}>
        <span>{title}</span>
        <span className="material-symbols-outlined">
          {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        </span>
      </div>
      {isOpen && (
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
