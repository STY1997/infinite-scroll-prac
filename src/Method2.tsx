import { useRef, useCallback } from 'react';
import PostCard from './PostCard';
import { useInfiniteQuery } from 'react-query';
import { getPostsPage } from './api/axios';
import { Post } from './interface/post';
import { stringify } from 'querystring';

const Method2 = () => {

    const {
        fetchNextPage, //function 
        hasNextPage, // boolean
        isFetchingNextPage, // boolean
        data,
        status,
        error
    } = useInfiniteQuery('/posts', ({ pageParam = 1 }) => getPostsPage(pageParam), {
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length ? allPages.length + 1 : undefined
        }
    });

    const intObserver= useRef<IntersectionObserver | null>(null);
    const lastPostRef = useCallback((post: any) => {
        if (isFetchingNextPage) return

        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                console.log('We are near the last post!')
                fetchNextPage();
            }
        })

        if (post) intObserver.current.observe(post);
    }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

    if (status === 'error') return <p className='center'>Error: {JSON.stringify(error)}</p>

    const content = data?.pages.map(pg => {
        return pg.map((post: Post, index: number) => {
            if (pg.length === index + 1) {
                return (<PostCard ref={lastPostRef} key={post.id} post={post} />);
            }
            return (<PostCard key={post.id} post={post} />);
        });
    });

    return (
        <>
            <h1 id="top">&infin; Infinite Query &amp; Scroll<br />&infin; Ex. 2 - React Query</h1>
            {content}
            {isFetchingNextPage && <p className="center">Loading More Posts...</p>}
            <p className="center"><a href="#top">Back to Top</a></p>
        </>
    )
}
export default Method2;