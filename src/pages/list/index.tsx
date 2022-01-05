// @ts-nocheck

import React, { useEffect } from "react";
import { useSmox } from "./store";

const store = {
  sex: 'boy'
}

const mutations = {
  change(state) {
    state.sex = state.sex === 'boy' ? 'girl' : 'boy'
  }
}

const actions = {
  asyncChange({ commit }, payload) {
    setTimeout(() => {
      commit('change', payload)
    }, 1000)
  }
}



export const Sex = () => {

  const [state, commit, dispatch] = useSmox(store, mutations, actions)
  console.log(state)
  return (
    <div>
      <h1>{state.sex}</h1>
      <button onClick={() => commit('change')}>变性</button>
      <button onClick={() => dispatch('asyncChange')}>异步变性</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Sex />
      <Sex />
    </div>
  );
}
