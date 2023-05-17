import {SERVER_URL} from "./constants";

export async function createAccount(data) {
    const account = await fetch(`${SERVER_URL}/create_account`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return account.json()
}

export async function getAllAccounts() {
    const account = await fetch(`${SERVER_URL}/accounts`, {
        method: "GET"
    });
    return account.json();
}

export default async function deleteAccount(id) {
    await fetch(`${SERVER_URL}/delete_account/${id}`, {
        method: "DELETE"
    });
}

export async function editAccount(data) {
    await fetch(`${SERVER_URL}/update_account/${data['_id']}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
