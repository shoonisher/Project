// src/redux/store.js
import { createStore } from 'redux';

const initialState = {
  isLoggedIn: !!localStorage.getItem('token')
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

const store = createStore(authReducer);

export default store;
