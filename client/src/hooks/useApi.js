import { useEffect, useRef, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'loading': return { data: undefined, loading: true, error: null };
    case 'success': return { data: action.data, loading: false, error: null };
    case 'error': return { data: undefined, loading: false, error: action.error };
    default: return state;
  }
}

export default function useApi(fetcher, deps = []) {
  const [state, dispatch] = useReducer(reducer, { data: undefined, loading: true, error: null });
  const fetcherRef = useRef(fetcher);

  useEffect(() => { fetcherRef.current = fetcher; });

  const refetch = () => {
    dispatch({ type: 'loading' });
    return Promise.resolve(fetcherRef.current())
      .then(result => dispatch({ type: 'success', data: result }))
      .catch(err => dispatch({ type: 'error', error: err instanceof Error ? err.message : 'An error occurred' }));
  };

  useEffect(() => {
    refetch();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch };
}
