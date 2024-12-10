import {configureStore} from "@reduxjs/toolkit";
import usersReducer from "./userslices";
//! store
const store = configureStore({
    reducer: {
        //  user reducers here
        users: usersReducer,
        // more reducers here
        },
       
        });
    export default store;     