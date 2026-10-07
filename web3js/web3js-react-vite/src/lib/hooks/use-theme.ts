import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@solana/wallet-adapter";

export type Theme = "light" | "dark";

export function useTheme() {
  const [stored, setStored] = useLocalStorage<Theme>("theme", "dark");
  const theme: Theme = stored === "light" ? "light" : "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(
    () => setStored((current) => (current === "light" ? "dark" : "light")),
    [setStored]
  );

  return { theme, toggleTheme };
}
