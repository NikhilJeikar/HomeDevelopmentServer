import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { user } from './Component/slice';
import { drive } from './Component/Drive/slice';
import {photo} from './Component/Photos/slice';


let middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
    const { logger } = require('redux-logger')
    middleware = [...middleware, logger]
  }
  
const store = configureStore({
    reducer:{
        user: user.reducer,
        drive: drive.reducer,
        photo: photo.reducer
    },
    middleware
});

export default store;