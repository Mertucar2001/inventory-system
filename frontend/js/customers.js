let editingId = null;
let lastSearchTerm = "";

const customerDialog = document.getElementById("customerDialog");
const customerForm = document.getElementById("customerForm");
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
const customersTable = document.getElementById("customersTable");

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
    const tbody = document.getElementById("customersTableBody");
    emptyState.hidden = true;
    customersTable.hidden = false;
    tbody.innerHTML = Array.from({ length: 3 }).map(() => `
        <tr class="skeleton-row">
            <td colspan="6"><div class="skeleton-bar"></div></td>
        </tr>
    `).join("");
}

function statsByCustomer(sales) {
    const stats = new Map();
    for (const sale of sales) {
        if (sale.customer_id == null) continue;
        const entry = stats.get(sale.customer_id) || { count: 0, total: 0 };
        entry.count += 1;
        entry.total += sale.sold_price * sale.quantity;
        stats.set(sale.customer_id, entry);
    }
    return stats;
}

async function loadCustomers() {
    const search = document.getElementById("searchInput").value.trim();
    lastSearchTerm = search;
    const url = search ? `/customers/?search=${encodeURIComponent(search)}` : "/customers/";
    hideError();
    renderSkeleton();
    try {
        const [customers, sales] = await Promise.all([apiGet(url), apiGet("/sales/")]);
        renderCustomers(customers, statsByCustomer(sales));
    } catch (e) {
        customersTable.hidden = true;
        emptyState.hidden = true;
        const message = e instanceof TypeError ? t("common.connectError") : e.message;
        showError(t("customers.errorLoad", { error: message }));
    }
}

function renderCustomers(customers, stats) {
    const tbody = document.getElementById("customersTableBody");

    if (customers.length === 0) {
        customersTable.hidden = true;
        emptyState.hidden = false;
        if (lastSearchTerm) {
            emptyStateTitle.textContent = t("customers.empty.searchTitle");
            emptyStateBody.textContent = t("customers.empty.searchBody", { term: lastSearchTerm });
            document.getElementById("emptyStateBtn").textContent = t("customers.empty.clearSearch");
        } else {
            emptyStateTitle.textContent = t("customers.empty.title");
            emptyStateBody.textContent = t("customers.empty.body");
            document.getElementById("emptyStateBtn").textContent = t("customers.empty.newBtn");
        }
        tbody.innerHTML = "";
        return;
    }

    customersTable.hidden = false;
    emptyState.hidden = true;

    tbody.innerHTML = customers.map(c => {
        const stat = stats.get(c.id) || { count: 0, total: 0 };
        return `
            <tr>
                <td data-label="${t('customers.table.name')}">${escapeHtml(c.name)}</td>
                <td data-label="${t('customers.table.phone')}">${escapeHtml(c.phone) || "—"}</td>
                <td data-label="${t('customers.table.email')}">${escapeHtml(c.email) || "—"}</td>
                <td data-label="${t('customers.table.salesCount')}" class="num">${stat.count}</td>
                <td data-label="${t('customers.table.totalAmount')}" class="num">${stat.count > 0 ? "€" + stat.total.toFixed(2) : "—"}</td>
                <td data-label="${t('customers.table.actions')}" class="actions">
                    <span class="row-actions">
                        <button type="button" class="btn btn-sm btn-ghost" onclick="openEditDialog(${c.id})">${t("common.edit")}</button>
                        <button type="button" class="btn btn-sm btn-danger-ghost" onclick="handleDelete(${c.id})">${t("common.delete")}</button>
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

function clearFieldErrors() {
    document.getElementById("customerNameError").textContent = "";
    document.getElementById("customerEmailError").textContent = "";
    document.getElementById("customerName").removeAttribute("aria-invalid");
    document.getElementById("customerEmail").removeAttribute("aria-invalid");
}

function refreshDialogTitle() {
    document.getElementById("dialogTitle").textContent = editingId
        ? t("customers.dialog.editTitle")
        : t("customers.dialog.newTitle");
}

function openCreateDialog() {
    editingId = null;
    clearFieldErrors();
    refreshDialogTitle();
    document.getElementById("customerId").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerEmail").value = "";
    customerDialog.showModal();
    document.getElementById("customerName").focus();
}

async function openEditDialog(id) {
    let customer;
    try {
        customer = await apiGet(`/customers/${id}`);
    } catch (e) {
        showToast(t("customers.toast.fetchError", { error: e.message }), "danger");
        return;
    }
    editingId = id;
    clearFieldErrors();
    refreshDialogTitle();
    document.getElementById("customerId").value = customer.id;
    document.getElementById("customerName").value = customer.name;
    document.getElementById("customerPhone").value = customer.phone || "";
    document.getElementById("customerEmail").value = customer.email || "";
    customerDialog.showModal();
    document.getElementById("customerName").focus();
}

async function handleSubmit(event) {
    event.preventDefault();
    clearFieldErrors();

    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");
    const name = nameInput.value.trim();
    let hasError = false;

    if (!name) {
        document.getElementById("customerNameError").textContent = t("customers.dialog.nameError");
        nameInput.setAttribute("aria-invalid", "true");
        hasError = true;
    }
    if (emailInput.value && !emailInput.checkValidity()) {
        document.getElementById("customerEmailError").textContent = t("customers.dialog.emailError");
        emailInput.setAttribute("aria-invalid", "true");
        hasError = true;
    }
    if (hasError) {
        (nameInput.getAttribute("aria-invalid") ? nameInput : emailInput).focus();
        return;
    }

    const data = {
        name,
        phone: document.getElementById("customerPhone").value || null,
        email: emailInput.value || null,
    };

    const saveBtn = document.getElementById("dialogSaveBtn");
    saveBtn.disabled = true;
    try {
        if (editingId) {
            await apiPut(`/customers/${editingId}`, data);
            showToast(t("customers.toast.updated"), "success");
        } else {
            await apiPost("/customers/", data);
            showToast(t("customers.toast.added"), "success");
        }
        customerDialog.close();
        loadCustomers();
    } catch (e) {
        showToast(t("common.saveFailed", { error: e.message }), "danger");
    } finally {
        saveBtn.disabled = false;
    }
}

async function handleDelete(id) {
    const confirmed = await confirmAction(t("customers.confirmDelete"));
    if (!confirmed) return;
    try {
        await apiDelete(`/customers/${id}`);
        showToast(t("customers.toast.deleted"), "success");
        loadCustomers();
    } catch (e) {
        showToast(t("common.deleteFailed", { error: e.message }), "danger");
    }
}

document.getElementById("newCustomerBtn").addEventListener("click", openCreateDialog);
document.getElementById("emptyStateBtn").addEventListener("click", () => {
    if (lastSearchTerm) {
        document.getElementById("searchInput").value = "";
        loadCustomers();
    } else {
        openCreateDialog();
    }
});
document.getElementById("dialogCancelBtn").addEventListener("click", () => customerDialog.close());
document.getElementById("dialogCloseBtn").addEventListener("click", () => customerDialog.close());
document.getElementById("errorRetryBtn").addEventListener("click", loadCustomers);
customerForm.addEventListener("submit", handleSubmit);

customerDialog.addEventListener("click", (event) => {
    if (event.target === customerDialog) customerDialog.close();
});

let searchDebounce = null;
document.getElementById("searchInput").addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(loadCustomers, 250);
});

document.addEventListener("i18n:langchange", () => {
    if (customerDialog.open) refreshDialogTitle();
    loadCustomers();
});

loadCustomers();
