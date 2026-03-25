// components/ThemeProvider.js
"use client"; // Ensure this is at the top

import { Moon, Sun } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create a Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to 'light'
  const [mounted, setMounted] = useState(false); // Track when component is mounted

  useEffect(() => {
    // This code runs only on the client
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    setMounted(true); // Mark the component as mounted

    // Set the initial theme based on device preference
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []); // Empty dependency array ensures it runs only once on mount

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // Apply theme to document
  };

  // Don't render the button until after mount to prevent hydration errors
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div>{children}</div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the context
export const useThemeProvider = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeProvider must be used within ThemeContext");
  }
  return context;
};
