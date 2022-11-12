import { useEffect, useState } from 'react';
import { getPostsPage } from '../api/axios';
import { Post } from '../interface/post';

type Error = {
  message: string;
}

const usePosts = (pageNum: number) => {

  const [error, setError] = useState<Error>({ message: "" });
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [results, setResults] = useState<Post[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({ message: "" });

    const controller = new AbortController();
    const { signal } = controller

    getPostsPage(pageNum, { signal })
        .then(data => {
            // 上一次的数据 + 新数据
            setResults(prev => [...prev, ...data]);
            // 如果fetch的数据是空的，就让hasNextPage为false
            setHasNextPage(Boolean(data.length));
            setIsLoading(false);
        })
        .catch(e => {
            setIsLoading(false);
            // 如果是abort造成的error就无视
            if (signal.aborted) return;
            setIsError(true);
            setError({ message: e.message });
        });

    // 销毁上一次fetch action
    return () => controller.abort();

  }, [pageNum]);

  return {
    isLoading,
    isError,
    error,
    results,
    hasNextPage
  }
}

export default usePosts;