const API_URL =
    "http://localhost:5000/api";


export async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem(
            "userToken"
        );


    const headers = {
        "Content-Type":
            "application/json",

        ...(options.headers || {})
    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    const response =
        await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    const data =
        await response
            .json()
            .catch(() => ({}));


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Request failed"
        );
    }


    return data;
}