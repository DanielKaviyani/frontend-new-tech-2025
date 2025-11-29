'use server';

export async function createPost(prevData: any, formData: FormData) {
  try {
    const title = formData.get('title');
    const body = formData.get('body');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            body,
        }),
        cache: 'no-cache',
    });

    if(!res.ok) {
        return {
            ok: false,
            errors: [],
            message: `${res.status}: ${res.statusText}`,
        }
    }

    const post = await res.json();

    return {
        ok: true,
        post: {
            id: post.id,
            title,
            body,
            userId: '1',
        },
    }
  } catch (error) {
    return {
        ok: false,
        errors: [error instanceof Error ? error.message : error],
        message: error instanceof Error ? error.message : error,
    }
  }
}