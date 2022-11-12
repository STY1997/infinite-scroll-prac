import React from 'react'
import { Post } from './interface/post';

export interface Props {
  post: Post;
};

// 记住写法，ref的type要写在前面
const PostCard = React.forwardRef<HTMLDivElement, Props>(({ post } , ref) => {

    const postBody: JSX.Element = (
        <>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>Post ID: {post.id}</p>
        </>
    )

    const content: JSX.Element = ref
        ? <article ref={ref}>{postBody}</article>
        : <article>{postBody}</article>

    return content;
})

export default PostCard;