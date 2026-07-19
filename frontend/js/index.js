const LOW_STOCK_THRESHOLD = 3;

const errorBanner = document.getElementById("errorBanner");
const errorBannerText = document.getElementById("errorBannerText");
const partsStat = document.getElementById("partsStat");
const salesStat = document.getElementById("salesStat");
const customersStat = document.getElementById("customersStat");

function showError(message) {
    errorBannerText.textContent = message;
    errorBanner.hidden = false;
}

function hideError() {
    errorBanner.hidden = true;
}

function isToday(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
}

function renderPartsStat(parts) {
    const attention = parts.filter(p => p.stock <= LOW_STOCK_THRESHOLD).length;
    const countFig = `<span class="figure">${parts.length}</span>`;
    let html = t("home.partsCount", { count: parts.length, countFig });
    if (attention > 0) {
        const attentionFig = `<span class="figure">${attention}</span>`;
        html += " · " + t("home.partsAttention", { count: attention, countFig: attentionFig });
    }
    partsStat.innerHTML = html;
    partsStat.classList.toggle("is-attention", attention > 0);
}

function renderSalesStat(sales) {
    const todaySales = sales.filter(s => isToday(s.created_at));
    if (todaySales.length === 0) {
        salesStat.textContent = t("home.salesNone");
        return;
    }
    const total = todaySales.reduce((sum, s) => sum + s.sold_price * s.quantity, 0);
    const countFig = `<span class="figure">${todaySales.length}</span>`;
    const totalFig = `<span class="figure">€${total.toFixed(2)}</span>`;
    salesStat.innerHTML = t("home.salesToday", { count: todaySales.length, countFig, totalFig });
}

function renderCustomersStat(customers) {
    const countFig = `<span class="figure">${customers.length}</span>`;
    customersStat.innerHTML = t("home.customersCount", { count: customers.length, countFig });
}

async function loadStats() {
    hideError();
    try {
        const [parts, sales, customers] = await Promise.all([
            apiGet("/parts/"),
            apiGet("/sales/"),
            apiGet("/customers/"),
        ]);
        renderPartsStat(parts);
        renderSalesStat(sales);
        renderCustomersStat(customers);
    } catch (e) {
        partsStat.textContent = "—";
        salesStat.textContent = "—";
        customersStat.textContent = "—";
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showError(t("home.errorLoad", { error: message }));
    }
}

document.getElementById("errorRetryBtn").addEventListener("click", loadStats);
document.addEventListener("i18n:langchange", loadStats);

loadStats();
