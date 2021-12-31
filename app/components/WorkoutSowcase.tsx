import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Workout } from '../firebase/config';
import globalStyles from '../config/globalStyles';
import { useDispatch } from 'react-redux';
import ExerciseTable from './ExerciseTable';

const WorkoutSowcase = ({
	workout,
	setWorkout,
}: {
	workout: Workout;
	setWorkout: Dispatch<SetStateAction<Workout | undefined>>;
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		setWorkout(workout);
	}, [workout]);

	//exercise table functions
	const updateExerciseName = (text: string, tableIndex: number) => {
		setWorkout({
			...workout,
			exercises: workout.exercises.map((el, index) =>
				index === tableIndex ? { ...el, name: text } : el
			),
		});
	};

	const addExerciseLine = (tableIndex: number) => {
		const setsLength = workout.exercises[tableIndex].sets.length;
		const newLineReps = workout.exercises[tableIndex].sets[setsLength - 1].reps || 10;
		const newLineWeight = workout.exercises[tableIndex].sets[setsLength - 1].weight || 0;
		//new line object
		const newLine = {
			reps: newLineReps,
			weight: newLineWeight,
		};
		//add to the previous table
		setWorkout({
			...workout,
			exercises: workout.exercises.map((el, index) =>
				index === tableIndex
					? { ...el, sets: [...workout.exercises[index].sets, newLine] }
					: el
			),
		});
	};
	const deleteSet = (line: number, tableIndex: number) => {
		const setsArray = [...workout.exercises[tableIndex].sets];
		setsArray.splice(line, 1);

		setWorkout({
			...workout,
			exercises: workout.exercises.map((el, index) =>
				index === tableIndex ? { ...el, sets: [...setsArray] } : el
			),
		});
	};
	const deleteTable = (tableIndex: number) => {
		// dispatch(deleteExercise({ tableIndex }));
	};

	const onExerciseInputChange = (
		text: string,
		lineIndex: number,
		column: string,
		tableIndex: number
	) => {
		setWorkout({
			...workout,
			exercises: workout.exercises.map((el, index) =>
				index === tableIndex
					? {
							...el,
							sets: el.sets.map((el2, index) =>
								index === lineIndex ? { ...el2, [column]: Number(text) } : el2
							),
					  }
					: el
			),
		});
	};

	return (
		<View>
			{workout.exercises.map((e, index) => (
				<View key={index} style={[globalStyles.componentElevated, styles.exercise]}>
					<ExerciseTable
						exercise={e}
						tableIndex={index}
						onChange={onExerciseInputChange}
						addExerciseLine={addExerciseLine}
						updateExerciseName={updateExerciseName}
						deleteLine={deleteSet}
						deleteExercise={deleteTable}
					/>
				</View>
			))}
		</View>
	);
};

export default WorkoutSowcase;

const styles = StyleSheet.create({
	exercise: { marginBottom: 10 },
	statContainer: { alignItems: 'center' },
	titleCenter: { textAlign: 'center' },
});
