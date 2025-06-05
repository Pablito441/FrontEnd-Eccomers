import React, { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  error,
  handleChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.InputGroup}>
      <label className={styles.labelform} htmlFor={name}>
        {label}
      </label>
      <div className={styles.inputWithIcon}>
        <input
          className={styles.formInput}
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />

        {isPasswordField && (
          <span
            className={`material-symbols-outlined ${styles.icon}`}
            onClick={toggleVisibility}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
