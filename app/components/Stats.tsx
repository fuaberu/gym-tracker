import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Workout } from '../firebase/config';
import { Exercise } from './ExerciseTable';
import globalStyles from '../config/globalStyles';
import millify from 'millify';

interface ExerciseDetailes {
	weight: number;
	reps: number;
	volumeLoad: number;
	oneRm?: number;
}

const Stats = ({
	workout,
	exercise,
	weightOption,
}: {
	workout?: Workout;
	exercise?: Exercise;
	weightOption: string;
}) => {
	const [detailes, setDetailes] = useState<ExerciseDetailes | null>(null);

	const createWorkoutDetailes = () => {
		let weight = 0;
		let reps = 0;
		let sets = 0;
		setDetailes(null);
		workout &&
			workout.exercises.forEach((e, i) => {
				e.sets.forEach((s) => (reps += s.reps));
				e.sets.forEach((s) => (weight += s.weight));
				e.sets.forEach(() => sets++);
			});
		weightOption === 'kg'
			? setDetailes({
					weight,
					reps,
					volumeLoad: weight * reps * sets,
			  })
			: setDetailes({
					weight: weight * 2.20462,
					reps,
					volumeLoad: weight * reps * sets * 2.20462,
			  });
	};
	const createExerciseDetailes = () => {
		if (!exercise) return;
		let weight = 0;
		let reps = 0;
		let oneRm = 0;
		exercise.sets.forEach((s) => (reps += s.reps));
		exercise.sets.forEach((s) => (weight += s.weight));
		exercise.sets.forEach((s) => {
			let BrzyckiValue = s.weight / (1.0278 - 0.0278 * s.reps);
			if (BrzyckiValue > oneRm) oneRm = Math.round(BrzyckiValue);
		});
		let volumeLoad = weight * reps * exercise.sets.length;
		weightOption === 'kg'
			? setDetailes({
					weight,
					reps,
					volumeLoad,
					oneRm,
			  })
			: setDetailes({
					weight: weight * 2.20462,
					reps,
					volumeLoad,
					oneRm,
			  });
	};

	useEffect(() => {
		exercise && createExerciseDetailes();
		workout && createWorkoutDetailes();
	}, [exercise, workout]);

	return (
		<View style={styles.exercise}>
			{detailes && (
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<View style={styles.statContainer}>
						<Text style={globalStyles.textPrimary}>Weight</Text>
						<Text style={globalStyles.textSecondary}>{`${millify(
							detailes.weight
						)} ${weightOption}`}</Text>
					</View>
					<View style={styles.statContainer}>
						<Text style={globalStyles.textPrimary}>Reps</Text>
						<Text style={globalStyles.textSecondary}>{millify(detailes.reps)}</Text>
					</View>
					<View style={styles.statContainer}>
						<Text style={globalStyles.textPrimary}>Volume</Text>
						<Text style={globalStyles.textSecondary}>{`${millify(
							detailes.volumeLoad
						)} ${weightOption}`}</Text>
					</View>
					{exercise && (
						<View style={styles.statContainer}>
							<Text style={globalStyles.textPrimary}>1RM</Text>
							<Text style={globalStyles.textSecondary}>{`${millify(
								detailes.oneRm ? detailes.oneRm : 0
							)} ${weightOption}`}</Text>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

export default Stats;

const styles = StyleSheet.create({
	exercise: { marginBottom: 10 },
	statContainer: { alignItems: 'center' },
	titleCenter: { textAlign: 'center' },
});
