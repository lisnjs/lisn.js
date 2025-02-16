import styles from "./shape-divider.module.css";

export const TopDivider = ({ className = "", height = "", color = "" }) => {
  return (
    <div className={[className, styles.divider].join(" ")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={height ? { height: height } : {}}
      >
        <path
          style={color ? { fill: color } : {}}
          d="M1200 0L0 0 892.25 114.72 1200 0z"
        ></path>
      </svg>
    </div>
  );
};

export default TopDivider;
