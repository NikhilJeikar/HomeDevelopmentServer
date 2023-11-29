import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { user } from './Component/slice';
import { drive } from './Component/Drive/slice';

let middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
    const { logger } = require('redux-logger')
    middleware = [...middleware, logger]
  }
  
const store = configureStore({
    reducer:{
        user: user.reducer,
        drive: drive.reducer
    },
    middleware
});

export default store;