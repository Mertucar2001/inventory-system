const API_URL = `http://${window.location.hostname}:8000`;

async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error("İstek başarısız: " + path);
    return res.json();
}

async function apiPost(path, data) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "İstek başarısız");
    }
    return res.json();
}

async function apiPut(path, data) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "İstek başarısız");
    }
    return res.json();
}

async function apiDelete(path) {
    const res = await fetch(`${API_URL}${path}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Silme başarısız");
    return res.json();
}