import {SERVER_URL} from "./constants";

export async function getAllCategories() {
    const cat = await fetch(`${SERVER_URL}/categories`, {
        method: "GET"
    });
    return cat.json();
}

export async function editCategories(data) {
    await fetch(`${SERVER_URL}/update_category/${data['_id']}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
