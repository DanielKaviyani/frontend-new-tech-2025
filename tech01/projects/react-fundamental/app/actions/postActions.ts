'use server';

interface Post {
    id: number
    title: string
    content: string
}

let posts: Post[] = [];

export async function GET() {
    return Response.json({
        ok: true,
        posts
    });
}

export async function createPost(prevouseState: any, formData: FormData) {
    try {
        const title = formData.get('title') as string | null;
        const content = formData.get('content') as string | null;

        if (!title || !content) {
            return { ok: false, message: 'Title and content are required' }; // plain object
        }

        const res = await fetch('https://jsonplaceholder.typicode.com/postssss', {
            method: 'POST',
            body: JSON.stringify({
                title,
                body: content,
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        if(!res.ok) {
            return {
                ok: false,
                message: `${res.status}: ${res.statusText}`
            }
        }

        const data = await res.json();

        posts.push(data);

        return {
            ok: true,
            message: 'Post created!',
            post: data
        };
    } catch (error) {
        return error;
    }
}


export async function deletePost(id: number) {
    posts = posts.filter(post => post.id !== id);
    return { ok: true, message: 'Post deleted!' };
}

export async function listPosts() {
    return posts;
}
