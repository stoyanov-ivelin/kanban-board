import { createStore } from '@reduxjs/toolkit';

const initialState = {
  issues: [
    {},
    {},
    {},
    {},
  ]
}

const reducer = (state = initialState, action: any) => {
  console.log(action);

  return state;
}

export const store = createStore(reducer);