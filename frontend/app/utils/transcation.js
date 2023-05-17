import {SERVER_URL} from "./constants";

export async function getAllTransactions() {
    const trans = await fetch(`${SERVER_URL}/transaction`, {
        method: "GET"
    });
    return trans.json();
}