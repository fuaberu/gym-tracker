import { createSlice } from '@reduxjs/toolkit';

export type UserData = null | {
	userId: string;
	fullname: string;
	email: string;
	createdAt: string;
	profilePic: string | null;
	options: { weight: string; length: string };
};

export type UserState = {
	loggedIn: boolean;
	data: UserData;
};

const initialState: UserState = {
	loggedIn: false,
	data: {
		userId: '',
		fullname: '',
		email: '',
		createdAt: '',
		profilePic: null,
		options: { weight: 'kg', length: 'cm' },
	},
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.loggedIn = true;
			state.data = action.payload;
		},
		logOut: (state) => {
			state.loggedIn = false;
			state.data = null;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setUserData, logOut } = userSlice.actions;

export default userSlice.reducer;
