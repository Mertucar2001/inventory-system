function syncLangRadios() {
    document.querySelectorAll('input[type="radio"][data-lang-option]').forEach((input) => {
        input.checked = input.getAttribute("data-lang-option") === currentLang;
    });
}

document.addEventListener("i18n:langchange", syncLangRadios);
syncLangRadios();

const toastEl = document.getElementById("toast");
let toastTimer = null;

function showToast(message, variant) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.className = "toast is-visible" + (variant ? ` is-${variant}` : "");
    toastTimer = setTimeout(() => {
        toastEl.classList.remove("is-visible");
    }, 3200);
}

const CSV_EXPORTS = [
    { path: "/parts/", filename: "als-berlin-parts.csv", columns: ["id", "name", "part_number", "condition", "brand", "vehicle_type", "car_brand", "car_model", "chassis_code", "is_remanufactured", "core_charge", "stock", "buy_price", "sell_price", "created_at"] },
    { path: "/sales/", filename: "als-berlin-sales.csv", columns: ["id", "part_id", "customer_id", "quantity", "sold_price", "core_returned", "core_value", "note", "created_at"] },
    { path: "/customers/", filename: "als-berlin-customers.csv", columns: ["id", "name", "phone", "email", "created_at"] },
];

function csvEscape(value) {
    if (value == null) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function toCsv(rows, columns) {
    const lines = [columns.join(",")];
    for (const row of rows) {
        lines.push(columns.map((col) => csvEscape(row[col])).join(","));
    }
    return lines.join("\r\n");
}

function downloadCsv(filename, csvContent) {
    // UTF-8 BOM so Excel on Windows reads Turkish/German characters
    // correctly instead of falling back to the system codepage.
    const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function handleExportData() {
    const btn = document.getElementById("exportDataBtn");
    btn.disabled = true;
    try {
        for (let i = 0; i < CSV_EXPORTS.length; i++) {
            const { path, filename, columns } = CSV_EXPORTS[i];
            const rows = await apiGet(path);
            downloadCsv(filename, toCsv(rows, columns));
            if (i < CSV_EXPORTS.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        }
        showToast(t("settings.data.exportSuccess"), "success");
    } catch (e) {
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showToast(t("settings.data.exportError", { error: message }), "danger");
    } finally {
        btn.disabled = false;
    }
}

document.getElementById("exportDataBtn").addEventListener("click", handleExportData);

function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatBackupSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadBackup(filename) {
    const link = document.createElement("a");
    link.href = `${API_URL}/backups/${encodeURIComponent(filename)}/download`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function renderBackups(backups) {
    const lastBackupValue = document.getElementById("lastBackupValue");
    const listPanel = document.getElementById("backupListPanel");

    if (!backups || backups.length === 0) {
        lastBackupValue.textContent = t("settings.backups.none");
        listPanel.innerHTML = `<div class="backup-row"><span class="backup-row-info"><span class="backup-row-date">${escapeHtml(t("settings.backups.empty"))}</span></span></div>`;
        return;
    }

    lastBackupValue.textContent = new Date(backups[0].created_at).toLocaleString(currentLocale());

    listPanel.innerHTML = backups.map((b) => `
        <div class="backup-row">
            <span class="backup-row-info">
                <span class="backup-row-date">${new Date(b.created_at).toLocaleString(currentLocale())}</span>
                <span class="backup-row-size">${formatBackupSize(b.size)}</span>
            </span>
            <button type="button" class="btn btn-sm btn-ghost" data-download="${escapeHtml(b.filename)}">${escapeHtml(t("settings.backups.downloadBtn"))}</button>
        </div>
    `).join("");

    listPanel.querySelectorAll("[data-download]").forEach((btn) => {
        btn.addEventListener("click", () => downloadBackup(btn.getAttribute("data-download")));
    });
}

async function loadBackups() {
    try {
        renderBackups(await apiGet("/backups/"));
    } catch (e) {
        document.getElementById("lastBackupValue").textContent = t("common.connectError");
    }
}

async function handleBackupNow() {
    const btn = document.getElementById("backupNowBtn");
    btn.disabled = true;
    try {
        await apiPost("/backups/", {});
        showToast(t("settings.backups.success"), "success");
        await loadBackups();
    } catch (e) {
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showToast(t("settings.backups.error", { error: message }), "danger");
    } finally {
        btn.disabled = false;
    }
}

document.getElementById("backupNowBtn").addEventListener("click", handleBackupNow);
document.addEventListener("i18n:langchange", loadBackups);
loadBackups();
