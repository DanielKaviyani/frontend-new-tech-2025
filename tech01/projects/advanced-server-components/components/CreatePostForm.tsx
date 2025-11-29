'use client';
import { createPost } from "@/app/actions/PostActions";
import { useActionState, useTransition } from "react";

export default function CreatePostForm({onCreate}: {onCreate: (post: FormData) => void}) {
    // const [state, formAction, isPending] = useActionState(createPost, {ok: false, errors: [], message: ''})

    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        startTransition(() => {
            onCreate(formData);
        })

        e.target.reset();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mt-6">
            <input 
                name="title"
                type="text"
                placeholder="title"
                className="border rounded-lg p-2"
            />
            <textarea 
                name="body"
                placeholder="body"
                className="border rounded-lg p-2"
            />

            <button type="submit" className="border rounded-lg p-4 bg-green-500 text-white">
                {isPending ? 'Creating...' : 'Create Post'}
            </button>
        </form>
    );
}