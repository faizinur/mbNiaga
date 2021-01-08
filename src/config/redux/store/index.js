import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Framework7StateKernel, framework7Reducer, syncFramework7WithStore } from 'framework7-redux';
import thunk from 'redux-thunk';

import {
  mainReducers as main,
  counterReducers as counter,
  regionReducers as region,
  userReducers as user
} from '../reducers/';

export const stateKernel = new Framework7StateKernel();

export const store = createStore(
  combineReducers({
    framework7: framework7Reducer,
    main: main,
    counter: counter,
    region: region,
    user : user,
    // ...
  }),
  applyMiddleware(thunk)
);

syncFramework7WithStore(store, stateKernel);
