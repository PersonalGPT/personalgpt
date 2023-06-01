import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./conversation/conversationSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
  },
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {chat: ChatState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
