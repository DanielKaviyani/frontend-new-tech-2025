'use server';

interface User {
    id: string
    username: string
    email: string
}

let users: User[] = [];

export async function createUser(prevState: any, formData: FormData) {
    try {
        const body = JSON.stringify({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        })
        const res = await fetch(`${process.env.NEXT_PUBLIC_REQRES_API_URL}/userssss`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body
        })
        
        if(!res.ok) {
            return {
                ok: false,
                message: `${res.status}: ${res.statusText}`
            }
        }

        return {
            ok: true,
            message: `${res.status}: ${res.statusText}`
        }
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}