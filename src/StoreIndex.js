import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import commonReducer from 'Views/Common/Slice/Common_slice';
import interviewReducer from "Views/InterviewCandidates/Slice/interviewSlice";

const reducers = combineReducers({
    commonState: commonReducer,
    interviewState: interviewReducer
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(thunk),
    devTools: true
})

export default store;