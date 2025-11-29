'use client';
import { create } from '../actions/post'

export default function CreatePostForm() {
    const handleSubmit = async (formData: FormData) => {
        await create(formData);
    }

    return <form action={handleSubmit}>
        <input name="title" />
        <br/>
        <textarea name="body" />
        <br/>
        <button type="submit">Create</button>
    </form>
}