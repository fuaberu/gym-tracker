import { createSlice } from '@reduxjs/toolkit';
import { Workout } from '../../firebase/config';

const initialState: Workout[] = [];

export const workoutsSlice = createSlice({
	name: 'workouts',
	initialState,
	reducers: {
		addWorkout: (state, { payload }) => {
			state.push(payload);
		},
		setReduxWorkouts: (state, { payload }) => {
			return payload;
		},
		clearWorkouts: (state) => {
			return [];
		},
		deleteWorkoutExercise: (state, { payload }) => {
			state.splice(payload.index, 1);
		},
		updateWorkoutExercise: (state, { payload }) => {
			state[payload.index] = payload.workout;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	addWorkout,
	setReduxWorkouts,
	clearWorkouts,
	deleteWorkoutExercise,
	updateWorkoutExercise,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
