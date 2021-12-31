import { createSlice } from '@reduxjs/toolkit';
import { Exercise } from '../../components/ExerciseTable';

const initialState: Exercise[] = [];

export const exercisesSlice = createSlice({
	name: 'exercises',
	initialState,
	reducers: {
		addNewExercise: (state, { payload }) => {
			state.push(payload);
		},
		updateExercise: (state, { payload }) => {
			if (isNaN(payload.text)) return;

			state[payload.tableIndex].sets[payload.lineIndex][payload.column] = payload.text;
		},
		updateName: (state, { payload }) => {
			state[payload.tableIndex].name = payload.text;
		},
		addLine: (state, { payload }) => {
			//new line data from the last input
			const setsLength = state[payload.index].sets.length;
			const newLineReps = state[payload.index].sets[setsLength - 1].reps || 0;
			const newLineWeight = state[payload.index].sets[setsLength - 1].weight || 0;
			//new line object
			const newLine = {
				reps: newLineReps,
				weight: newLineWeight,
			};
			//add to the previous table
			state[payload.index].sets.push(newLine);
		},
		deleteLine: (state, { payload }) => {
			state[payload.tableIndex].sets.splice(payload.line, 1);
		},
		deleteExercise: (state, { payload }) => {
			state.splice(payload.tableIndex, 1);
		},
		clearExercises: (state) => {
			return [];
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	addNewExercise,
	updateExercise,
	updateName,
	addLine,
	deleteLine,
	deleteExercise,
	clearExercises,
} = exercisesSlice.actions;

export default exercisesSlice.reducer;
