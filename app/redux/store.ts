import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import exercisesReducer from './slices/exercisesSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		exercises: exercisesReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
