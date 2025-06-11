import React, { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  label?: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  error,
  handleChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={`${styles.InputGroup} ${!label ? styles.noLabel : ""}`}>
      {label && (
        <label className={styles.labelform} htmlFor={name}>
          {label}
        </label>
      )}
      <div className={styles.inputWithIcon}>
        <input
          className={`${styles.formInput} ${error ? styles.errorInput : ""}`}
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
        />

        {isPasswordField && (
          <span
            className={`material-symbols-outlined ${styles.icon} ${
              error ? styles.errorIcon : ""
            }`}
            onClick={toggleVisibility}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        )}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
};
