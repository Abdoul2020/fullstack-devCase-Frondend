import { configureStore } from '@reduxjs/toolkit';
import { usersSlice } from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
