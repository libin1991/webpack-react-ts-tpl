// @ts-nocheck

import React, { useEffect } from "react";
import useStore, { createStore, useLocalStore } from "@/lib/js/index";
import counterStore from "./store";

const Counter = () => {
  //console.log(useStore(counterStore))
  const {
    state: { count, age, name, list },
    actions
  } = useStore(counterStore);
  return (
    <>
      <h1>Counter</h1>
      <h2>Count {count} {age} {name}</h2>
      <button onClick={() => actions.decrement()}>-</button>
      <button onClick={() => actions.increment()}>+</button>
      <button onClick={() => actions.changeage(age + 2)}>age</button>
      <button onClick={() => actions.changeageSync()}>ageSync</button>
      <ul>
        {list.map((item, index) => {
          return <li key={index}>{`${item.title} ${item.done}`}</li>
        })}
      </ul>
      <button onClick={() => actions.addList()}>addList</button>
    </>
  );
};

const LocalCounter = () => {
  const {
    state: { count, age, name },
    actions
  } = useLocalStore(counterStore);

  useEffect(() => {
    actions.random();
  }, []);

  return (
    <>
      <h1>Local Counter</h1>
      <h2>Count {count}  {age} {name}</h2>
      <button onClick={() => actions.decrement()}>-</button>
      <button onClick={() => actions.increment()}>+</button>
      <button onClick={() => actions.changeage(age + 1)}>age</button>
      <button onClick={() => actions.changeageSync()}>ageSync</button>
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Counter />
      <Counter />  <Counter />
      <LocalCounter />
      <LocalCounter />
    </div>
  );
}
