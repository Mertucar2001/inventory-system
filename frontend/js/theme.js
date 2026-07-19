const THEME_STORAGE_KEY = "als-theme";

function getStoredTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

function setTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
}

function initThemeToggle() {
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;
    toggle.checked = getStoredTheme() === "dark";
    toggle.addEventListener("change", () => {
        setTheme(toggle.checked ? "dark" : "light");
    });
}

applyTheme(getStoredTheme());
initThemeToggle();
