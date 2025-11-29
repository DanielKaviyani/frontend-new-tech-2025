'use client';
import { createPost } from "@/app/actions/PostActions";
import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState } from "react";
import CreatePostForm from "./CreatePostForm";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: string;
}

export default function PostList({initialPosts}: {initialPosts: Post[]}) {

    const [posts, setPosts] = useState(initialPosts);
    const [optimisticPosts, setOptimisticPosts] = useOptimistic(posts, (currentPost, newPost) => ([newPost, ...currentPost]));


    const handleCreatePost = async (formData: FormData) => {
        const newPost = {
            id: Date.now(),
            title: formData.get('title') as string,
            body: formData.get('body') as string,
            userId: '1',
        }
        setOptimisticPosts(newPost);

        const result = await createPost(null, formData);

        if (result.ok) {
            setPosts((prev) => [result.post, ...prev]);
        }
    }
    return (
        <section>
            <CreatePostForm onCreate={handleCreatePost} />
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-6 gap-4">
            {
            optimisticPosts.map((post: Post) => (
                <Link key={post.id} href='/'>
                <div className="border border-gray-700 dark:border-gray-100 rounded-lg p-1 h-full">
                    <Image 
                    src='https://picsum.photos/500'
                    alt="blog-post"
                    width={500}
                    height={500}
                    quality={80}
                    className="w-full h-auto object-cover rounded-lg"
                    />
                    <h2 className="text-2xl font-bold mt-3 px-2">
                    {post.title}
                    </h2>
                    <p className="text-lg mt-2 px-2">
                    {post.body}
                    </p>
                </div>
                </Link>
            ))
            }
            </div>
        </section>
    )
}