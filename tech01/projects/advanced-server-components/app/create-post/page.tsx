'use client';

import { useActionState } from "react";
import { createPost } from "../actions/PostActions";

export default function CreatePost() {

    const [state, formAction, isPending] = useActionState(createPost, {ok: false, errors: [], message: ''})

    return (
        <section className="container py-14">
            <h1 className="text-3xl font-bold underline">CREATE POST!</h1>

            <form action={formAction} className="flex flex-col gap-4 max-w-sm mt-6">
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

            <p className="text-green-500 mt-2">
                {state.message || ''}
            </p>
        </section>
    );
}