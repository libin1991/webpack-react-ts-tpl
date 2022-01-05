import { useState, useCallback } from "react";



const INITIAL_STATE = {
  data: undefined,
  error: undefined,
  loading: false,
};

export const usePromise = (
  asyncFunction
) => {
  const [state, setState] = useState(INITIAL_STATE);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, [setState]);

  const call = useCallback(
    (...args) =>
      new Promise((resolve, reject) => {
        setState({ loading: true });
        let mounted = true;
        (asyncFunction)(...args)
          .then((data) => {
            if (mounted) {
              setState({ data, loading: false });
              resolve(data);
            }
          })
          .catch((error) => {
            if (mounted) {
              setState({ error, loading: false, data: undefined });
              reject(error);
            }
          });
        return () => {
          mounted = false;
        };
      }),
    [asyncFunction, setState]
  );

  return [state, call, reset];
};

export default usePromise;
