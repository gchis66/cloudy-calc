// js/utils/theme-loader.js

async function applySavedThemeAndFont() {
  const OPTIONS_STORAGE_KEY_THEME = "options_theme";
  const OPTIONS_STORAGE_KEY_FONT_SIZE = "options_fontSize";
  const DEFAULT_THEME = "light";
  const DEFAULT_FONT_SIZE = "16px";

  if (!self.storageUtil) {
    console.warn(
      "ThemeLoader: Storage utility not available. Using default theme/font."
    );
    document.body.classList.add(`theme-${DEFAULT_THEME}`);
    document.documentElement.style.setProperty(
      "--global-font-size",
      DEFAULT_FONT_SIZE
    );
    return;
  }

  try {
    const options = await self.storageUtil.loadState([
      OPTIONS_STORAGE_KEY_THEME,
      OPTIONS_STORAGE_KEY_FONT_SIZE,
    ]);
    const currentTheme = options[OPTIONS_STORAGE_KEY_THEME] || DEFAULT_THEME;
    const currentFontSize =
      options[OPTIONS_STORAGE_KEY_FONT_SIZE] || DEFAULT_FONT_SIZE;

    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${currentTheme}`);
    document.documentElement.style.setProperty(
      "--global-font-size",
      currentFontSize
    );
    console.log(
      "ThemeLoader: Applied theme:",
      currentTheme,
      "Font size:",
      currentFontSize
    );
  } catch (error) {
    console.error("ThemeLoader: Error loading options, using defaults:", error);
    document.body.classList.add(`theme-${DEFAULT_THEME}`);
    document.documentElement.style.setProperty(
      "--global-font-size",
      DEFAULT_FONT_SIZE
    );
  }
}

// Apply theme as soon as the script is loaded and DOM is available for body class manipulation.
// Using DOMContentLoaded ensures body exists. storageUtil should already be loaded.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applySavedThemeAndFont);
} else {
  applySavedThemeAndFont();
}
