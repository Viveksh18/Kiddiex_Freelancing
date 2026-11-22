const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAdminKey = () => sessionStorage.getItem("kiddiex_admin_key");


async function request(endpoint, options = {}) {
    const headers = {
        Authorization: `Bearer ${getAdminKey()}`,
        ...options.headers,
    };

    // Let the browser set Content-Type and multipart boundary for image uploads.
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "API request failed");
    }

    return result;
}

export const adminApi = {
    getMembers: () => request("/api/members"),

    getMember: (id) =>
        request(`/api/members/${encodeURIComponent(id)}`),

    addMember: (data) =>
        request("/api/members", {
            method: "POST",
            body: data,
        }),

    updateMember: (id, data) =>
        request(`/api/members/${encodeURIComponent(id)}`, {
            method: "PUT",
            body: data,
        }),
    deleteMember: (id) =>
        request(`/api/members/${encodeURIComponent(id)}`, {
            method: "DELETE",
        }),

            // projects
    getProjects: () => request("/api/projects"),
    getAdminProjects: () => request("/api/projects/admin/list"),
    getAdminProject: (id) =>
        request(`/api/projects/admin/${encodeURIComponent(id)}`),

    addProject: (data) =>
        request("/api/projects", { method: "POST", body: JSON.stringify(data) }),

    updateProject: (id, data) =>
        request(`/api/projects/${encodeURIComponent(id)}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteProject: (id, permanent = false) =>
        request(`/api/projects/${encodeURIComponent(id)}?permanent=${permanent}`, {
            method: "DELETE",
        }),

    uploadImage: (file) => {
        const data = new FormData();
        data.append("image", file);
        return request("/api/uploads/image", { method: "POST", body: data });
    },
};