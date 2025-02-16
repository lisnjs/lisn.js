import styles from "./theme-switch.module.css";

export const ThemeSwitch = ({
  theme,
  setTheme,
  size = 22,
  color = "var(--text-color)",
}) => {
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      className={styles.switch}
      aria-label="Toggle theme"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          r="10"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <path d="M24 14A10 10 0 0 1 34 24A10 10 0 0 1 24 34Z" fill={color} />
        <path
          d="M24 4V8M24 40V44M4 24H8M40 24H44M10 10L14 14M34 34L38 38M10 38L14 34M34 14L38 10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default ThemeSwitch;
