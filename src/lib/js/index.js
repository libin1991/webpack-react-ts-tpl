import { useState, useEffect, SetStateAction, Dispatch, useMemo } from "react";
import usePromise from "./usePromise";

const deepClone = (obj) => {
  if (!(obj instanceof Object) || obj instanceof Function) {
    return obj;
  }
  if (Array.isArray(obj)) {
    const arrayObj = new Array(obj.length);
    for (let i = 0; i < obj.length; i++) {
      arrayObj[i] = deepClone(obj[i]);
    }
    return arrayObj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source);
  }
  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
};


function asyncState(data) {
  return {
    data: data || null,
    loading: false,
  };
}

const copyState = (state) => {
  // is primitive
  if (!(state instanceof Object)) {
    return state;
  }
  // is array
  if (Array.isArray(state)) {
    return [...state];
  }

  // is object
  return {
    ...state,
  };
};


const mapActions = (internals, reducers, stateReceiver) => {
  return Object.entries(reducers).reduce((acc, [key, reducer]) => {
    acc[key] = async (payload) => {
      const currentState = copyState(stateReceiver.receiveState());
      if (window["GLOBAL_HOOK_DEBUG"]) {
        console.log(`Invoking action: ${key}\n- State before:`, currentState);
      }
      const newState = await reducer(currentState, payload, internals.utils);
      stateReceiver.setState(newState);
      if (window["GLOBAL_HOOK_DEBUG"]) {
        console.log(`Done invoking action: ${key}\n- State after:`, newState);
      }
      return newState;
    };
    return acc;
  },
    {}
  );
};

const applySettersGetters = (internals, state) => {
  Object.entries(internals.setters).forEach(([k, setter]) => {
    state.__defineSetter__(k, setter);
  });
  Object.entries(internals.getters).forEach(([k, getter]) => {
    state.__defineGetter__(k, getter);
  });
};


function createStore(
  initialState,
  ...reducerArray
) {
  const reducers = reducerArray.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      acc[key] = curr[key];
    });
    return acc;
  }, {});

  const internals = {
    reducers,
    initialState: deepClone(initialState),
    setStateSet: new Set(),
    setters: {},
    getters: {},
    actions: {},
    utils: {},
  };
  const setState = (state) => {
    applySettersGetters(internals, state);
    actionStore.state = state;
    internals.setStateSet.forEach((setStateFunction) => {
      setStateFunction(state);
    });
  };

  if (initialState instanceof Object) {
    Object.keys(initialState).forEach((key) => {
      const setter = (initialState).__lookupSetter__(key);
      const getter = (initialState).__lookupGetter__(key);
      if (setter) {
        internals.setters[key] = setter;
      }
      if (getter) {
        internals.getters[key] = getter;
      }
    });
  }

  const actionStore = {
    setState,
    state: initialState,
    actions: {},
    ["__internal"]: internals,
  };

  const stateReceiver = {
    setState,
    receiveState: () => actionStore.state,
    store: actionStore,
  };

  internals.utils = {
    setState: stateReceiver.setState,
    asyncAction: async (
      key,
      promise,
      throwError = false
    ) => {
      if (window["GLOBAL_HOOK_DEBUG"]) {
        console.log("- Async action start:", key);
      }
      let state = stateReceiver.receiveState();
      let asyncStateObj = state[key];
      delete asyncStateObj.error;
      asyncStateObj.loading = true;
      stateReceiver.setState({ ...state, [key]: asyncStateObj });
      try {
        const data = await promise;
        asyncStateObj = {
          data,
          loading: false,
        };
        if (window["GLOBAL_HOOK_DEBUG"]) {
          console.log("- Async action complete:", key);
        }
      } catch (error) {
        asyncStateObj.loading = false;
        asyncStateObj.error = error;
        if (window["GLOBAL_HOOK_DEBUG"]) {
          console.error("- Async action error:", key);
        }
        if (throwError) {
          throw error;
        }
      }

      state = stateReceiver.receiveState();
      return { ...state, [key]: asyncStateObj };
    },
    reset: (...keys) => {
      if (window["GLOBAL_HOOK_DEBUG"]) {
        console.log("Calling store reset for:", keys);
      }
      if (keys.length === 0) {
        return deepClone(internals.initialState);
      }
      const state = stateReceiver.receiveState();
      const resetedState = {};
      keys.forEach((a) => {
        resetedState[a] = internals.initialState[a];
      });
      return { ...state, ...deepClone(resetedState) };
    },
    receiveState: stateReceiver.receiveState,
  };

  const actions = mapActions(internals, reducers, stateReceiver);

  actionStore.actions = actions;
  internals.actions = actions;

  return actionStore;
}

const useStore = (store) => {
  const [_, setState] = useState(store.state);

  const internals = (store)["__internal"];
  const setters = internals.setStateSet;

  useEffect(() => {
    setters.add(setState);
  }, [setters]);

  useEffect(
    () => () => {
      setters.delete(setState);
    },
    [setters]
  );

  return store;
};

const useLocalStore = (store) => {
  const internals = (store)["__internal"];
  const [sa, internalSetState] = useState(() => {
    const stateReceiver = {
      store: {},
      receiveState: () => store.state,
      setState: (s) => { },
    };
    return {
      stateReceiver,
      state: store.state,
      actions: mapActions(internals, internals.reducers, stateReceiver)
    };
  });

  useEffect(
    () => () => {
      sa.stateReceiver.setState = (s) => { };
    },
    [sa.stateReceiver]
  );

  const { state, actions, stateReceiver } = sa;

  const receiver = () => {
    return state;
  };

  stateReceiver.receiveState = receiver;

  const setState = (newState) => {
    applySettersGetters(internals, newState);
    internalSetState({
      actions,
      stateReceiver,
      state: newState,
    });
  };

  const actionStore = {
    state,
    setState,
    actions,
  };

  stateReceiver.setState = setState;
  stateReceiver.store = actionStore;

  return actionStore;
};

function useStoreReset(
  store,
  ...keys
) {
  const keyHash = keys.join("|||");
  useEffect(
    () => () => {
      const internals = (store)["__internal"];
      internals.utils.setState(
        internals.utils.reset.apply(null, keyHash.split("|||"))
      );
    },
    [store, keyHash]
  );
}

export default useStore;
export { useLocalStore, asyncState, createStore, useStoreReset, usePromise };
