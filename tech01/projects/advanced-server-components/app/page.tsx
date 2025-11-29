import PostList from "@/components/PostList";

export default async function Home() {
  // the posts are fetched from the API
  // it's SERVER-SIDE rendered
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  const initialPosts = await res.json();

  return (
    <section className="container py-14">
      <h1 className="text-3xl font-bold underline">BLOG POSTS!</h1>

      <PostList initialPosts={initialPosts} />
    </section>
  );
}
