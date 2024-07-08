"use client";

////////////////////////////////////////
/// reducer setting start
////////////////////////////////////////
import { useReducer, useState } from "react";

type Data = {
  age: number;
  name: string;
}

type ActionType = 'age-add' | 'age-minus' | 'change-name';

type Action = {
  type: ActionType;
} & Omit<Partial<Data>, 'age'>;

function reducer(state: Data, action: Action): Data {
  switch (action.type) {
    case 'age-add': {
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'age-minus': {
      return {
        ...state,
        age: state.age - 1
      };
    }
    case 'change-name': {
      if (typeof action.name !== 'string') throw new Error(`action.name is undefined.`);
      return {
        ...state,
        name: action.name,
      };
    }
    default: 

      break;
  }
  throw Error('Unknown action.');
}

const initData: Data = {
  age: 42,
  name: '홍길동',
};

function createInitialState(state: Data) {
  console.log('@createInitialState', state);
  // state.age = 0;
  return state;
}
////////////////////////////////////////
/// reducer setting end
////////////////////////////////////////

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initData, createInitialState);
  const [inputedText, setInputedText] = useState('');

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <button
          onClick={() => {
            dispatch({ type: 'age-add' });
          }}
          >
          age 1 증가
        </button>
      </div>
      <div className="w-full flex flex-wrap gap-2 relative">
        <button
          onClick={() => {
            dispatch({ type: 'age-minus' });
          }}
          >
          age 1 감소
        </button>
      </div>
      <div className="w-full flex flex-wrap gap-2 relative">
        <input type="text" value={inputedText} onChange={e => setInputedText(e.target.value)} />
        <button
          onClick={() => {
            dispatch({ type: 'change-name', name: inputedText });
          }}
          >
          name 변경
        </button>
      </div>
      <div className="w-full flex flex-wrap gap-2 relative">
        <div className="w-full flex flex-wrap gap-2 relative">age: {state.age}</div>
        <div className="w-full flex flex-wrap gap-2 relative">name: {state.name}</div>
      </div>
    </>
  );
}