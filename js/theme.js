'use strict';
/* ================================================
   SEACET Nexus — Theme Management
   ================================================ */
const ThemeManager = (() => {
  const THEME_KEY = 'seacet-theme';
  const ACCENT_KEY = 'seacet-accent';
  const FONTSIZE_KEY = 'seacet-fontsize';

  const init = () => {
    const theme = localStorage.getItem(THEME_KEY) || 'light';
    const accent = localStorage.getItem(ACCENT_KEY) || 'blue';
    const fontSize = localStorage.getItem(FONTSIZE_KEY) || 'medium';
    applyTheme(theme);
    applyAccent(accent);
    applyFontSize(fontSize);
    updateIcons(theme);
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateIcons(theme);
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    return next;
  };

  const updateIcons = (theme) => {
    document.querySelectorAll('.icon-sun').forEach(el => el.style.display = theme === 'dark' ? 'none' : 'block');
    document.querySelectorAll('.icon-moon').forEach(el => el.style.display = theme === 'dark' ? 'block' : 'none');
  };

  const applyAccent = (color) => {
    document.documentElement.setAttribute('data-accent', color);
    localStorage.setItem(ACCENT_KEY, color);
  };

  const setAccentColor = (color) => { applyAccent(color); };
  const getAccentColor = () => localStorage.getItem(ACCENT_KEY) || 'blue';

  const applyFontSize = (size) => {
    document.documentElement.setAttribute('data-fontsize', size);
    localStorage.setItem(FONTSIZE_KEY, size);
  };

  const setFontSize = (size) => { applyFontSize(size); };
  const getFontSize = () => localStorage.getItem(FONTSIZE_KEY) || 'medium';
  const getTheme = () => localStorage.getItem(THEME_KEY) || 'light';

  const resetPreferences = () => {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(ACCENT_KEY);
    localStorage.removeItem(FONTSIZE_KEY);
    applyTheme('light');
    applyAccent('blue');
    applyFontSize('medium');
  };

  return { init, toggleTheme, setAccentColor, getAccentColor, setFontSize, getFontSize, getTheme, resetPreferences };
})();

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
