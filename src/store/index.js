// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {thunk} from 'redux-thunk';
// import logger from 'redux-logger';
import reducers from './reducers';

// Combine all reducers
const rootReducer = combineReducers(reducers);

// Setup middleware
const middleware = [thunk];

// Uncomment logger for development
// if (__DEV__) {
//   middleware.push(logger);
// }

// Create store with DevTools support
export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);
