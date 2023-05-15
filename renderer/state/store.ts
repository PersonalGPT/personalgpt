import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chat/chatSlice";
import conversationReducer from "./conversation/conversationSlice";
import { conversationApi } from "./services/conversation";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    [conversationApi.reducerPath]: conversationApi.reducer,
    chat: chatReducer,
    conversation: conversationReducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(conversationApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {chat: ChatState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
