let editingId = null;
let lastSearchTerm = "";

const partDialog = document.getElementById("partDialog");
const partForm = document.getElementById("partForm");
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
const partsTable = document.getElementById("partsTable");

const LOW_STOCK_THRESHOLD = 3;
let toastTimer = null;

const VEHICLE_TYPE_KEY = {
    "Otomobil": "car",
    "Kamyon": "truck",
    "Motosiklet": "motorcycle",
    "Otobüs": "bus",
    "Tarım/İş Makinesi": "agri",
};

function vehicleTypeLabel(value) {
    const key = VEHICLE_TYPE_KEY[value];
    return key ? t("parts.vehicleType." + key) : (value || "—");
}

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

function renderSkeleton() {
    const tbody = document.getElementById("partsTableBody");
    emptyState.hidden = true;
    partsTable.hidden = false;
    tbody.innerHTML = Array.from({ length: 3 }).map(() => `
        <tr class="skeleton-row">
            <td colspan="10"><div class="skeleton-bar"></div></td>
        </tr>
    `).join("");
}

async function loadParts() {
    const search = document.getElementById("searchInput").value.trim();
    const vehicleType = document.getElementById("vehicleTypeFilter").value;
    lastSearchTerm = search;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (vehicleType) params.set("vehicle_type", vehicleType);
    const query = params.toString();
    const url = query ? `/parts/?${query}` : "/parts/";
    hideError();
    renderSkeleton();
    try {
        const parts = await apiGet(url);
        renderParts(parts);
    } catch (e) {
        partsTable.hidden = true;
        emptyState.hidden = true;
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showError(t("parts.errorLoad", { error: message }));
    }
}

function conditionLabel(value) {
    if (value === "Yeni") return t("parts.dialog.conditionNew");
    if (value === "Yenilenmiş") return t("parts.dialog.conditionRefurbished");
    return value || "—";
}

function stockPill(stock) {
    if (stock <= 0) return { label: t("parts.pill.outOfStock"), className: "pill-danger" };
    if (stock <= LOW_STOCK_THRESHOLD) return { label: t("parts.pill.lowStock"), className: "pill-danger" };
    return { label: t("parts.pill.inStock"), className: "pill-success" };
}

function renderParts(parts) {
    const tbody = document.getElementById("partsTableBody");

    if (parts.length === 0) {
        partsTable.hidden = true;
        emptyState.hidden = false;
        if (lastSearchTerm) {
            emptyStateTitle.textContent = t("parts.empty.searchTitle");
            emptyStateBody.textContent = t("parts.empty.searchBody", { term: lastSearchTerm });
            document.getElementById("emptyStateBtn").textContent = t("parts.empty.clearSearch");
        } else {
            emptyStateTitle.textContent = t("parts.empty.title");
            emptyStateBody.textContent = t("parts.empty.body");
            document.getElementById("emptyStateBtn").textContent = t("parts.empty.newBtn");
        }
        tbody.innerHTML = "";
        return;
    }

    partsTable.hidden = false;
    emptyState.hidden = true;

    tbody.innerHTML = parts.map(part => {
        const pill = stockPill(part.stock);
        const car = [part.car_brand, part.car_model].filter(Boolean).join(" ") || "—";
        const vehicleTag = `<span class="tag">${escapeHtml(vehicleTypeLabel(part.vehicle_type))}</span>`;
        const remanBadge = part.is_remanufactured
            ? `<span class="pill pill-remanufactured">${escapeHtml(t("parts.dialog.conditionRefurbished"))}</span>`
            : "";
        return `
            <tr>
                <td data-label="${t('parts.table.name')}">${escapeHtml(part.name)}${remanBadge}</td>
                <td data-label="${t('parts.table.oeNumber')}" class="code">${escapeHtml(part.part_number) || "—"}</td>
                <td data-label="${t('parts.table.brand')}">${escapeHtml(part.brand) || "—"}</td>
                <td data-label="${t('parts.table.vehicle')}">${escapeHtml(car)}${vehicleTag}</td>
                <td data-label="${t('parts.table.condition')}">${escapeHtml(conditionLabel(part.condition))}</td>
                <td data-label="${t('parts.table.stock')}" class="num">${part.stock}</td>
                <td data-label="${t('parts.table.buyPrice')}" class="num">${part.buy_price != null ? "€" + part.buy_price.toFixed(2) : "—"}</td>
                <td data-label="${t('parts.table.sellPrice')}" class="num">${part.sell_price != null ? "€" + part.sell_price.toFixed(2) : "—"}</td>
                <td data-label="${t('parts.table.stockStatus')}"><span class="pill ${pill.className}">${escapeHtml(pill.label)}</span></td>
                <td data-label="${t('parts.table.actions')}" class="actions">
                    <span class="row-actions">
                        <button type="button" class="btn btn-sm btn-ghost" onclick="openEditDialog(${part.id})">${t("common.edit")}</button>
                        <button type="button" class="btn btn-sm btn-danger-ghost" onclick="handleDelete(${part.id})">${t("common.delete")}</button>
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function clearFieldError() {
    const errorEl = document.getElementById("partNameError");
    errorEl.textContent = "";
    document.getElementById("partName").removeAttribute("aria-invalid");
}

function refreshDialogTitle() {
    document.getElementById("dialogTitle").textContent = editingId
        ? t("parts.dialog.editTitle")
        : t("parts.dialog.newTitle");
}

function updateCoreChargeVisibility() {
    const isReman = document.getElementById("partIsRemanufactured").checked;
    document.getElementById("coreChargeField").hidden = !isReman;
    if (!isReman) document.getElementById("partCoreCharge").value = "";
}

function openCreateDialog() {
    editingId = null;
    clearFieldError();
    refreshDialogTitle();
    document.getElementById("partId").value = "";
    document.getElementById("partName").value = "";
    document.getElementById("partNumber").value = "";
    document.getElementById("partCondition").value = "Yeni";
    document.getElementById("partBrand").value = "";
    document.getElementById("partVehicleType").value = "Otomobil";
    document.getElementById("partCarBrand").value = "";
    document.getElementById("partCarModel").value = "";
    document.getElementById("partChassisCode").value = "";
    document.getElementById("partStock").value = 0;
    document.getElementById("partBuyPrice").value = "";
    document.getElementById("partSellPrice").value = "";
    document.getElementById("partIsRemanufactured").checked = false;
    document.getElementById("partCoreCharge").value = "";
    updateCoreChargeVisibility();
    partDialog.showModal();
    document.getElementById("partName").focus();
}

async function openEditDialog(id) {
    let part;
    try {
        part = await apiGet(`/parts/${id}`);
    } catch (e) {
        showToast(t("parts.toast.fetchError", { error: e.message }), "danger");
        return;
    }
    editingId = id;
    clearFieldError();
    refreshDialogTitle();
    document.getElementById("partId").value = part.id;
    document.getElementById("partName").value = part.name;
    document.getElementById("partNumber").value = part.part_number || "";
    document.getElementById("partCondition").value = part.condition || "Yeni";
    document.getElementById("partBrand").value = part.brand || "";
    document.getElementById("partVehicleType").value = part.vehicle_type || "Otomobil";
    document.getElementById("partCarBrand").value = part.car_brand || "";
    document.getElementById("partCarModel").value = part.car_model || "";
    document.getElementById("partChassisCode").value = part.chassis_code || "";
    document.getElementById("partStock").value = part.stock;
    document.getElementById("partBuyPrice").value = part.buy_price ?? "";
    document.getElementById("partSellPrice").value = part.sell_price ?? "";
    document.getElementById("partIsRemanufactured").checked = !!part.is_remanufactured;
    document.getElementById("partCoreCharge").value = part.core_charge ?? "";
    updateCoreChargeVisibility();
    partDialog.showModal();
    document.getElementById("partName").focus();
}

async function handleSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById("partName");
    const name = nameInput.value.trim();

    if (!name) {
        document.getElementById("partNameError").textContent = t("parts.dialog.nameError");
        nameInput.setAttribute("aria-invalid", "true");
        nameInput.focus();
        return;
    }
    clearFieldError();

    const isRemanufactured = document.getElementById("partIsRemanufactured").checked;
    const data = {
        name,
        part_number: document.getElementById("partNumber").value || null,
        condition: document.getElementById("partCondition").value,
        brand: document.getElementById("partBrand").value || null,
        vehicle_type: document.getElementById("partVehicleType").value,
        car_brand: document.getElementById("partCarBrand").value || null,
        car_model: document.getElementById("partCarModel").value || null,
        chassis_code: document.getElementById("partChassisCode").value || null,
        is_remanufactured: isRemanufactured,
        core_charge: isRemanufactured ? (parseFloat(document.getElementById("partCoreCharge").value) || null) : null,
        stock: parseInt(document.getElementById("partStock").value, 10) || 0,
        buy_price: parseFloat(document.getElementById("partBuyPrice").value) || null,
        sell_price: parseFloat(document.getElementById("partSellPrice").value) || null,
    };

    const saveBtn = document.getElementById("dialogSaveBtn");
    saveBtn.disabled = true;
    try {
        if (editingId) {
            await apiPut(`/parts/${editingId}`, data);
            showToast(t("parts.toast.updated"), "success");
        } else {
            await apiPost("/parts/", data);
            showToast(t("parts.toast.added"), "success");
        }
        partDialog.close();
        loadParts();
    } catch (e) {
        showToast(t("common.saveFailed", { error: e.message }), "danger");
    } finally {
        saveBtn.disabled = false;
    }
}

async function handleDelete(id) {
    const confirmed = await confirmAction(t("parts.confirmDelete"));
    if (!confirmed) return;
    try {
        await apiDelete(`/parts/${id}`);
        showToast(t("parts.toast.deleted"), "success");
        loadParts();
    } catch (e) {
        showToast(t("common.deleteFailed", { error: e.message }), "danger");
    }
}

document.getElementById("newPartBtn").addEventListener("click", openCreateDialog);
document.getElementById("emptyStateBtn").addEventListener("click", () => {
    if (lastSearchTerm) {
        document.getElementById("searchInput").value = "";
        loadParts();
    } else {
        openCreateDialog();
    }
});
document.getElementById("dialogCancelBtn").addEventListener("click", () => partDialog.close());
document.getElementById("dialogCloseBtn").addEventListener("click", () => partDialog.close());
document.getElementById("errorRetryBtn").addEventListener("click", loadParts);
partForm.addEventListener("submit", handleSubmit);

partDialog.addEventListener("click", (event) => {
    if (event.target === partDialog) partDialog.close();
});

let searchDebounce = null;
document.getElementById("searchInput").addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(loadParts, 250);
});
document.getElementById("vehicleTypeFilter").addEventListener("change", loadParts);
document.getElementById("partIsRemanufactured").addEventListener("change", updateCoreChargeVisibility);

document.addEventListener("i18n:langchange", () => {
    if (partDialog.open) refreshDialogTitle();
    loadParts();
});

loadParts();
