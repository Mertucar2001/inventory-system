const errorBanner = document.getElementById("errorBanner");
const errorBannerText = document.getElementById("errorBannerText");
const customRange = document.getElementById("customRange");
const rangeStartInput = document.getElementById("rangeStart");
const rangeEndInput = document.getElementById("rangeEnd");
const netProfitCard = document.getElementById("netProfitCard");
const topPartsList = document.getElementById("topPartsList");
const lowStockList = document.getElementById("lowStockList");

let currentPreset = "today";

function showError(message) {
    errorBannerText.textContent = message;
    errorBanner.hidden = false;
}

function hideError() {
    errorBanner.hidden = true;
}

function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function pad2(n) {
    return String(n).padStart(2, "0");
}

function toISODate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diffToMonday);
    return result;
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function computeRange() {
    const today = new Date();
    if (currentPreset === "today") {
        return { start: toISODate(today), end: toISODate(today) };
    }
    if (currentPreset === "week") {
        return { start: toISODate(startOfWeek(today)), end: toISODate(today) };
    }
    if (currentPreset === "month") {
        return { start: toISODate(startOfMonth(today)), end: toISODate(today) };
    }
    if (currentPreset === "custom") {
        return { start: rangeStartInput.value || null, end: rangeEndInput.value || null };
    }
    return { start: null, end: null };
}

function setLoading() {
    ["statSalesCount", "statRevenue", "statCost", "statNetProfit", "statPendingCount"].forEach((id) => {
        document.getElementById(id).textContent = "…";
    });
    document.getElementById("statPendingValue").textContent = "";
    netProfitCard.classList.remove("is-positive", "is-negative");
}

function renderStats(data) {
    document.getElementById("statSalesCount").textContent = data.sales_count;
    document.getElementById("statRevenue").textContent = "€" + data.revenue.toFixed(2);
    document.getElementById("statCost").textContent = "€" + data.cost.toFixed(2);
    document.getElementById("statNetProfit").textContent = "€" + data.net_profit.toFixed(2);

    netProfitCard.classList.remove("is-positive", "is-negative");
    if (data.net_profit > 0) netProfitCard.classList.add("is-positive");
    else if (data.net_profit < 0) netProfitCard.classList.add("is-negative");

    document.getElementById("statPendingCount").textContent = data.pending_cores.count;
    document.getElementById("statPendingValue").textContent = "€" + data.pending_cores.total_value.toFixed(2);
}

function renderTopParts(items) {
    if (!items || items.length === 0) {
        topPartsList.innerHTML = `<p class="report-empty">${escapeHtml(t("reports.topParts.empty"))}</p>`;
        return;
    }
    topPartsList.innerHTML = items.map((item, index) => `
        <div class="report-row">
            <span class="report-row-name">
                <span class="report-row-rank">${index + 1}</span>
                <span class="report-row-label">${escapeHtml(item.name)}</span>
            </span>
            <span class="report-row-value">${escapeHtml(t("reports.topParts.qty", { count: item.quantity }))}</span>
        </div>
    `).join("");
}

function lowStockPillHtml(stock) {
    const label = stock <= 0 ? t("parts.pill.outOfStock") : t("parts.pill.lowStock");
    return `<span class="pill pill-danger">${escapeHtml(label)}</span>`;
}

function renderLowStock(items) {
    if (!items || items.length === 0) {
        lowStockList.innerHTML = `<p class="report-empty">${escapeHtml(t("reports.lowStock.empty"))}</p>`;
        return;
    }
    lowStockList.innerHTML = items.map((item) => `
        <div class="report-row">
            <span class="report-row-name">
                <span class="report-row-label">${escapeHtml(item.name)}</span>
            </span>
            <span class="report-row-value">${lowStockPillHtml(item.stock)}</span>
        </div>
    `).join("");
}

async function loadReport() {
    hideError();
    setLoading();
    const { start, end } = computeRange();
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    const qs = params.toString();

    try {
        const data = await apiGet(`/reports/summary${qs ? "?" + qs : ""}`);
        renderStats(data);
        renderTopParts(data.top_parts);
        renderLowStock(data.low_stock_parts);
    } catch (e) {
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showError(t("reports.errorLoad", { error: message }));
    }
}

function setPreset(preset) {
    currentPreset = preset;
    document.querySelectorAll(".range-preset-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.range === preset));
    });
    customRange.hidden = preset !== "custom";
    if (preset === "custom") {
        const today = toISODate(new Date());
        if (!rangeStartInput.value) rangeStartInput.value = today;
        if (!rangeEndInput.value) rangeEndInput.value = today;
    }
    loadReport();
}

document.querySelectorAll(".range-preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => setPreset(btn.dataset.range));
});
rangeStartInput.addEventListener("change", () => { if (currentPreset === "custom") loadReport(); });
rangeEndInput.addEventListener("change", () => { if (currentPreset === "custom") loadReport(); });
document.getElementById("errorRetryBtn").addEventListener("click", loadReport);
document.addEventListener("i18n:langchange", loadReport);

setPreset(currentPreset);
