import { useState, useRef, useCallback } from 'react'
import usePosts from './hooks/usePosts'
import PostCard from './PostCard'

const Method1 = () => {
    const [pageNum, setPageNum] = useState<number>(1);
    const {
        isLoading,
        isError,
        error,
        results,
        hasNextPage
    } = usePosts(pageNum);

    const intObserver = useRef<IntersectionObserver | null>(null);
    const lastPostRef = useCallback((postcard: any) => {
        if (isLoading) return;

        if (intObserver.current) intObserver.current.disconnect();

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                console.log('We are near the last post!');
                setPageNum(prev => prev + 1);
            };
        });

        if (postcard) intObserver.current.observe(postcard);
    }, [isLoading, hasNextPage]);

    if (isError) return (<p className='center'>Error: {error.message}</p>);

    const content = results.map((post, index: number) => {
        if (results.length === index + 1) {
            return (<PostCard ref={lastPostRef} key={post.id} post={post} />);
        };
        return (<PostCard key={post.id} post={post} />);
    });

    return (
        <>
            <h1 id="top">&infin; Infinite Query &amp; Scroll<br />&infin; Ex. 1 - React only</h1>
            {content}
            {isLoading && <p className="center">Loading More Posts...</p>}
            <p className="center"><a href="#top">Back to Top</a></p>
        </>
    );
}
export default Method1;