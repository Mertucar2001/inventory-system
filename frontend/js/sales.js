let allParts = [];
let allCustomers = [];
let lastSales = [];

const saleDialog = document.getElementById("saleDialog");
const saleForm = document.getElementById("saleForm");
const confirmDialog = document.getElementById("confirmDialog");
const confirmMessage = document.getElementById("confirmMessage");
const confirmOkBtn = document.getElementById("confirmOkBtn");
const confirmCancelBtn = document.getElementById("confirmCancelBtn");
const toastEl = document.getElementById("toast");
const errorBanner = document.getElementById("errorBanner");
const errorBannerText = document.getElementById("errorBannerText");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const emptyStateBody = document.getElementById("emptyStateBody");
const emptyStateBtn = document.getElementById("emptyStateBtn");
const emptyStateLink = document.getElementById("emptyStateLink");
const salesTable = document.getElementById("salesTable");
const newSaleBtn = document.getElementById("newSaleBtn");

let toastTimer = null;

function showToast(message, variant) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.className = "toast is-visible" + (variant ? ` is-${variant}` : "");
    toastTimer = setTimeout(() => {
        toastEl.classList.remove("is-visible");
    }, 3200);
}

function confirmAction(message) {
    confirmMessage.textContent = message;
    confirmDialog.showModal();
    return new Promise((resolve) => {
        const cleanup = (result) => {
            confirmOkBtn.removeEventListener("click", onOk);
            confirmCancelBtn.removeEventListener("click", onCancel);
            confirmDialog.removeEventListener("cancel", onCancel);
            confirmDialog.close();
            resolve(result);
        };
        const onOk = () => cleanup(true);
        const onCancel = () => cleanup(false);
        confirmOkBtn.addEventListener("click", onOk);
        confirmCancelBtn.addEventListener("click", onCancel);
        confirmDialog.addEventListener("cancel", onCancel);
    });
}

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

function renderSkeleton() {
    const tbody = document.getElementById("salesTableBody");
    emptyState.hidden = true;
    salesTable.hidden = false;
    tbody.innerHTML = Array.from({ length: 3 }).map(() => `
        <tr class="skeleton-row">
            <td colspan="7"><div class="skeleton-bar"></div></td>
        </tr>
    `).join("");
}

function updateNewSaleAvailability() {
    const hasParts = allParts.length > 0;
    newSaleBtn.disabled = !hasParts;
    newSaleBtn.title = hasParts ? "" : t("sales.newBtnDisabledHint");
}

async function loadReferenceData() {
    [allParts, allCustomers] = await Promise.all([apiGet("/parts/"), apiGet("/customers/")]);
    updateNewSaleAvailability();
}

function isPendingCore(sale) {
    const part = allParts.find(p => p.id === sale.part_id);
    return !!(part && part.is_remanufactured && !sale.core_returned);
}

function visibleSales() {
    const pendingOnly = document.getElementById("pendingCoreFilter").checked;
    return pendingOnly ? lastSales.filter(isPendingCore) : lastSales;
}

async function loadSales() {
    hideError();
    renderSkeleton();
    try {
        lastSales = await apiGet("/sales/");
        renderSales(visibleSales());
    } catch (e) {
        salesTable.hidden = true;
        emptyState.hidden = true;
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showError(t("sales.errorLoad", { error: message }));
    }
}

function saleTotal(sale, part) {
    let total = sale.sold_price * sale.quantity;
    if (part && part.is_remanufactured && !sale.core_returned && part.core_charge) {
        total += part.core_charge;
    }
    return total;
}

function corePillHtml(sale, part) {
    if (!part || !part.is_remanufactured) return "—";
    return sale.core_returned
        ? `<span class="pill pill-success">${escapeHtml(t("sales.pill.coreReceived"))}</span>`
        : `<span class="pill pill-danger">${escapeHtml(t("sales.pill.corePending"))}</span>`;
}

function renderSales(sales) {
    const tbody = document.getElementById("salesTableBody");
    const pendingOnly = document.getElementById("pendingCoreFilter").checked;

    if (sales.length === 0) {
        salesTable.hidden = true;
        emptyState.hidden = false;
        if (allParts.length === 0) {
            emptyStateTitle.textContent = t("sales.empty.title");
            emptyStateBody.textContent = t("sales.empty.needsPart");
            emptyStateLink.hidden = false;
            emptyStateBtn.hidden = true;
        } else if (pendingOnly) {
            emptyStateTitle.textContent = t("sales.empty.noPendingCoresTitle");
            emptyStateBody.textContent = t("sales.empty.noPendingCoresBody");
            emptyStateLink.hidden = true;
            emptyStateBtn.hidden = true;
        } else {
            emptyStateTitle.textContent = t("sales.empty.title");
            emptyStateBody.textContent = t("sales.empty.body");
            emptyStateLink.hidden = true;
            emptyStateBtn.hidden = false;
        }
        tbody.innerHTML = "";
        return;
    }

    salesTable.hidden = false;
    emptyState.hidden = true;

    tbody.innerHTML = sales.map(s => {
        const part = allParts.find(p => p.id === s.part_id);
        const customer = allCustomers.find(c => c.id === s.customer_id);
        const date = new Date(s.created_at).toLocaleDateString(currentLocale());
        const total = saleTotal(s, part).toFixed(2);
        const pending = isPendingCore(s);
        return `
            <tr>
                <td data-label="${t('sales.table.date')}">${date}</td>
                <td data-label="${t('sales.table.part')}">${part ? escapeHtml(part.name) : t("sales.table.deletedPart")}</td>
                <td data-label="${t('sales.table.customer')}">${customer ? escapeHtml(customer.name) : "—"}</td>
                <td data-label="${t('sales.table.quantity')}" class="num">${s.quantity}</td>
                <td data-label="${t('sales.table.amount')}" class="num">€${total}</td>
                <td data-label="${t('sales.table.core')}">${corePillHtml(s, part)}</td>
                <td data-label="${t('sales.table.note')}">${escapeHtml(s.note) || "—"}</td>
                <td data-label="${t('sales.table.actions')}" class="actions">
                    <span class="row-actions">
                        ${pending ? `<button type="button" class="btn btn-sm btn-ghost" onclick="handleMarkCoreReturned(${s.id})">${t("sales.action.markCoreReturned")}</button>` : ""}
                        <button type="button" class="btn btn-sm btn-danger-ghost" onclick="handleDelete(${s.id})">${t("common.delete")}</button>
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

function clearFieldErrors() {
    document.getElementById("salePartError").textContent = "";
    document.getElementById("salePriceError").textContent = "";
    document.getElementById("stockWarning").textContent = "";
    document.getElementById("salePart").removeAttribute("aria-invalid");
    document.getElementById("saleSoldPrice").removeAttribute("aria-invalid");
}

function selectedPart() {
    const select = document.getElementById("salePart");
    const id = parseInt(select.value, 10);
    return allParts.find(p => p.id === id) || null;
}

function checkStock() {
    const part = selectedPart();
    const quantityInput = document.getElementById("saleQuantity");
    const warning = document.getElementById("stockWarning");
    const quantity = parseInt(quantityInput.value, 10) || 0;

    if (!part) {
        warning.textContent = "";
        return true;
    }

    quantityInput.max = part.stock;

    if (quantity > part.stock) {
        warning.textContent = t("sales.dialog.stockWarning", { stock: part.stock });
        return false;
    }
    warning.textContent = "";
    return true;
}

async function openCreateDialog() {
    if (allParts.length === 0) return;

    try {
        [allParts, allCustomers] = await Promise.all([apiGet("/parts/"), apiGet("/customers/")]);
        updateNewSaleAvailability();
    } catch (e) {
        showToast(t("sales.toast.refDataError", { error: e.message }), "danger");
        return;
    }

    clearFieldErrors();

    const partSelect = document.getElementById("salePart");
    partSelect.innerHTML = allParts.map(p => `
        <option value="${p.id}" data-price="${p.sell_price || 0}" data-stock="${p.stock}" ${p.stock <= 0 ? "disabled" : ""}>
            ${escapeHtml(p.name)} (${t("sales.dialog.stockLabel", { stock: p.stock })}${p.stock <= 0 ? t("sales.dialog.outOfStockSuffix") : ""})
        </option>
    `).join("");

    const customerSelect = document.getElementById("saleCustomer");
    customerSelect.innerHTML = `<option value="">${t("sales.dialog.customerNone")}</option>` + allCustomers.map(c =>
        `<option value="${c.id}">${escapeHtml(c.name)}</option>`
    ).join("");

    document.getElementById("saleQuantity").value = 1;
    document.getElementById("saleNote").value = "";
    document.getElementById("saleCoreReturned").checked = false;

    onPartChange();
    saleDialog.showModal();
    partSelect.focus();
}

function updateTotal() {
    const part = selectedPart();
    const quantity = parseInt(document.getElementById("saleQuantity").value, 10) || 0;
    const price = parseFloat(document.getElementById("saleSoldPrice").value) || 0;
    const coreReturned = document.getElementById("saleCoreReturned").checked;
    const isReman = !!(part && part.is_remanufactured);
    const coreCharge = isReman ? (part.core_charge || 0) : 0;

    let total = quantity * price;
    const noteEl = document.getElementById("saleTotalNote");
    if (isReman && coreCharge > 0) {
        if (coreReturned) {
            noteEl.textContent = t("sales.dialog.coreWaivedNote");
        } else {
            total += coreCharge;
            noteEl.textContent = t("sales.dialog.coreChargeNote", { amount: coreCharge.toFixed(2) });
        }
    } else {
        noteEl.textContent = "";
    }
    document.getElementById("saleTotalValue").textContent = "€" + total.toFixed(2);
}

function onPartChange() {
    const part = selectedPart();
    document.getElementById("saleSoldPrice").value = part ? (part.sell_price ?? "") : "";
    const isReman = !!(part && part.is_remanufactured);
    document.getElementById("coreReturnedField").hidden = !isReman;
    if (!isReman) document.getElementById("saleCoreReturned").checked = false;
    checkStock();
    updateTotal();
}

async function handleSubmit(event) {
    event.preventDefault();
    clearFieldErrors();

    const partSelect = document.getElementById("salePart");
    const priceInput = document.getElementById("saleSoldPrice");
    const part = selectedPart();
    const price = parseFloat(priceInput.value);
    let hasError = false;

    if (!part) {
        document.getElementById("salePartError").textContent = t("sales.dialog.partError");
        partSelect.setAttribute("aria-invalid", "true");
        hasError = true;
    }
    if (!price || price <= 0) {
        document.getElementById("salePriceError").textContent = t("sales.dialog.priceError");
        priceInput.setAttribute("aria-invalid", "true");
        hasError = true;
    }
    if (part && !checkStock()) {
        hasError = true;
    }
    if (hasError) {
        (partSelect.getAttribute("aria-invalid") ? partSelect : priceInput).focus();
        return;
    }

    const isReman = !!part.is_remanufactured;
    const coreReturned = isReman && document.getElementById("saleCoreReturned").checked;
    const data = {
        part_id: part.id,
        customer_id: document.getElementById("saleCustomer").value ? parseInt(document.getElementById("saleCustomer").value, 10) : null,
        quantity: parseInt(document.getElementById("saleQuantity").value, 10) || 1,
        sold_price: price,
        note: document.getElementById("saleNote").value || null,
        core_returned: coreReturned,
        core_value: coreReturned ? (part.core_charge || null) : null,
    };

    const saveBtn = document.getElementById("dialogSaveBtn");
    saveBtn.disabled = true;
    try {
        await apiPost("/sales/", data);
        showToast(t("sales.toast.added"), "success");
        saleDialog.close();
        await loadReferenceData();
        loadSales();
    } catch (e) {
        showToast(t("common.saveFailed", { error: e.message }), "danger");
    } finally {
        saveBtn.disabled = false;
    }
}

async function handleDelete(id) {
    const confirmed = await confirmAction(t("sales.confirmDelete"));
    if (!confirmed) return;
    try {
        await apiDelete(`/sales/${id}`);
        showToast(t("sales.toast.deleted"), "success");
        await loadReferenceData();
        loadSales();
    } catch (e) {
        showToast(t("common.deleteFailed", { error: e.message }), "danger");
    }
}

async function handleMarkCoreReturned(id) {
    const sale = lastSales.find(s => s.id === id);
    const part = sale ? allParts.find(p => p.id === sale.part_id) : null;
    try {
        await apiPut(`/sales/${id}/core`, {
            core_returned: true,
            core_value: part ? (part.core_charge || null) : null,
        });
        showToast(t("sales.toast.coreUpdated"), "success");
        loadSales();
    } catch (e) {
        showToast(t("common.saveFailed", { error: e.message }), "danger");
    }
}

newSaleBtn.addEventListener("click", openCreateDialog);
emptyStateBtn.addEventListener("click", openCreateDialog);
document.getElementById("dialogCancelBtn").addEventListener("click", () => saleDialog.close());
document.getElementById("dialogCloseBtn").addEventListener("click", () => saleDialog.close());
document.getElementById("errorRetryBtn").addEventListener("click", init);
document.getElementById("salePart").addEventListener("change", onPartChange);
document.getElementById("saleQuantity").addEventListener("input", () => { checkStock(); updateTotal(); });
document.getElementById("saleSoldPrice").addEventListener("input", updateTotal);
document.getElementById("saleCoreReturned").addEventListener("change", updateTotal);
document.getElementById("pendingCoreFilter").addEventListener("change", () => renderSales(visibleSales()));
saleForm.addEventListener("submit", handleSubmit);

saleDialog.addEventListener("click", (event) => {
    if (event.target === saleDialog) saleDialog.close();
});

document.addEventListener("i18n:langchange", init);

async function init() {
    hideError();
    renderSkeleton();
    try {
        await loadReferenceData();
        loadSales();
    } catch (e) {
        salesTable.hidden = true;
        emptyState.hidden = true;
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showError(t("sales.errorLoadAll", { error: message }));
    }
}

init();
