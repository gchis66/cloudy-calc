// js/options.js - Options Page Logic

const OPTIONS_STORAGE_KEY_THEME = "options_theme";
const OPTIONS_STORAGE_KEY_FONT_SIZE = "options_fontSize";
const DEFAULT_THEME = "light";
const DEFAULT_FONT_SIZE = "16px";

document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("theme-select");
  const fontSizeInput = document.getElementById("font-size-input");
  const saveButton = document.getElementById("save-options-button");
  const statusMessage = document.getElementById("status-message");

  // Function to apply current settings to the options page itself
  function applyOptionsToPage(theme, fontSize) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
    document.documentElement.style.setProperty("--global-font-size", fontSize);
    if (fontSizeInput) fontSizeInput.placeholder = fontSize; // Update placeholder to current
  }

  // Load saved options and populate UI
  async function loadOptions() {
    if (!self.storageUtil) {
      console.error("Storage utility not available.");
      statusMessage.textContent = "Error: Storage utility not loaded.";
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

      if (themeSelect) themeSelect.value = currentTheme;
      if (fontSizeInput) fontSizeInput.value = currentFontSize; // Set current value, not placeholder

      applyOptionsToPage(currentTheme, currentFontSize);
      console.log("Options loaded:", {
        theme: currentTheme,
        fontSize: currentFontSize,
      });
    } catch (error) {
      console.error("Error loading options:", error);
      statusMessage.textContent = "Error loading options.";
    }
  }

  // Save options to storage
  async function saveOptions() {
    if (!self.storageUtil) {
      console.error("Storage utility not available.");
      statusMessage.textContent = "Error: Storage utility not loaded.";
      return;
    }
    try {
      const theme = themeSelect ? themeSelect.value : DEFAULT_THEME;
      const fontSize =
        fontSizeInput && fontSizeInput.value.trim() !== ""
          ? fontSizeInput.value.trim()
          : DEFAULT_FONT_SIZE;

      await self.storageUtil.saveState({
        [OPTIONS_STORAGE_KEY_THEME]: theme,
        [OPTIONS_STORAGE_KEY_FONT_SIZE]: fontSize,
      });
      applyOptionsToPage(theme, fontSize);
      statusMessage.textContent =
        "Options saved! Reload other extension parts to see changes.";
      console.log("Options saved:", { theme, fontSize });
      setTimeout(() => {
        statusMessage.textContent = "";
      }, 3000);
    } catch (error) {
      console.error("Error saving options:", error);
      statusMessage.textContent = "Error saving options.";
    }
  }

  if (saveButton) {
    saveButton.addEventListener("click", saveOptions);
  }

  // Load options when the page is ready
  loadOptions();
});
