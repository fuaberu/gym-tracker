import { createSlice } from '@reduxjs/toolkit';

export type UserData = null | {
	userId: string;
	fullname: string;
	email: string;
	createdAt: number;
	weight: number;
	height: number;
	profilePic: string | null;
	options: { weight: string; length: string };
};

export type UserState = {
	loggedIn: boolean;
	data: UserData;
};

// const initialState: UserState = {
// 	loggedIn: false,
// 	data: {
// 		userId: '',
// 		fullname: '',
// 		email: '',
// 		createdAt: '',
// 		profilePic: null,
// 		options: { weight: 'kg', length: 'cm' },
// 	},
// };
const initialState: UserState = {
	loggedIn: true,
	data: {
		createdAt: 1640631703063,
		email: 'test@gmail.com',
		fullname: 'test',
		height: 193,
		weight: 90,
		options: {
			length: 'cm',
			weight: 'kg',
		},
		profilePic: null,
		userId: 'iOo6FWoeHggT2d9mSiM2BVT3YYt1',
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
