import styles from "./Button.module.css";

interface ButtonProps {
  text?: string;
  disabled?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  text = "Enviar",
  disabled = false,
}) => {
  return (
    <div className={styles.formButtonContainer}>
      <button className={styles.formButton} type="submit" disabled={disabled}>
        {text}
      </button>
    </div>
  );
};
