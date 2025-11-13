'use server';
const API_URL = 'https://jsonplaceholder.typicode.com'

export async function list() {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    return data;
}

export async function create(formData: FormData) {
    const title = formData.get('title');
    const body = formData.get('body');
    const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            body,
        }),
    });
    const data = await res.json();
    return data;
}

export async function update() {}

export async function remove() {}