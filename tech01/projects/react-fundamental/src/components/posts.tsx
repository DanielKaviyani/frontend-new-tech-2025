'use client';
// import { use } from 'react';
import { useState, useDeferredValue, useMemo } from 'react';

const POSTS = Array.from({length: 1000}, (_, i) => ({id: i, title: `Post ${i}`}))

export default function Posts({postsPromise}: {postsPromise: unknown}) {
    // const posts = use(postsPromise);
    const [search, setSearch] = useState('');

    const deferedValue = useDeferredValue(search, '')

    const filteredPosts = useMemo(() => {
        return POSTS.filter((post) => post.title.includes(deferedValue))
    }, [deferedValue])
    return (
        <div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <p>Showing {filteredPosts.length} posts</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredPosts.map((post: {id: number, title: string}) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td><b>{post.title}</b></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}