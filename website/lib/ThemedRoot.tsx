"use client";
import { useState } from "react";

import ThemeSwitch from "./ThemeSwitch";

export const ThemedRoot = ({ className = "", children }) => {
  // no need for context
  const [theme, setTheme] = useState("dark");

  return (
    <html lang="en" className={[`${theme}-theme`, className].join(" ")}>
      <body>
        <ThemeSwitch theme={theme} setTheme={setTheme} />
        {children}
      </body>
    </html>
  );
};

export default ThemedRoot;
