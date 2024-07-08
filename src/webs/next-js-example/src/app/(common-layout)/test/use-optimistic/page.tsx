"use client";

import { useEffect, useOptimistic, useState } from "react";

interface Item {
  id: number;
  name: string;
  isCompleted: boolean;
}

export default function Page() {
  const [todos, setTodos] = useState<Item[]>([
    {
      id: 1, name: '홍길동', isCompleted: true,
    },
  ]);
  const [optimisticTodos, addNewTodo] = useOptimistic(
    todos,
    (state: Item[], newTodo: Item) => {
      return [...state, newTodo];
    }
  );
 
  const action = async(data: FormData) => {
    const name = data.get('name');
    if (typeof name !== 'string') {
      alert('name is not string');
      return;
    }

    const newTodo: Item = {
      id: Math.random(),
      name,
      isCompleted: false,
      //... other fields
    };
 
    //  we are using the useOptimistic hook
    // to add the new todo to the list before sending it to the server
    console.log('@addNewTodo...');
    addNewTodo(newTodo);
    // await createTodo(title);

    // server fetch..
    await new Promise(function(resolve, reject) {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  };

  // useEffect(() => {
  //   setTodos(prev => [...prev, { id: Math.random, name: '짱구', isCompleted: false}]);
  // }, []);
 
  return (
    <div>
      <form action={action}>
        <input type="text" name="name" className="inline-flex border border-slate-500 text-xs px-2 py-1" />
        <button type="submit">Add Todo</button>
      </form>
      <br />
      <ul className="flex flex-wrap w-[500px] gap-1">
        {
          optimisticTodos?.map((todo, index) => {
            return (
              <li key={todo.name + '_' + index} className="w-full flex flex-wrap border border-blue-500 p-2">
                name: { todo.name }, isComplete: { todo.isCompleted ? 'true' : 'false'}
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}