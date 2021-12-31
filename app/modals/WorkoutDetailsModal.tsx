import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../Navigation';
import { deleteDbWorkouts, updateDbWorkouts, Workout } from '../firebase/config';
import { RootState } from '../redux/store';
import colorStyles from '../config/colors';
import globalStyles from '../config/globalStyles';
import LinearButton from '../components/LinearButton';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import WorkoutSowcase from '../components/WorkoutSowcase';
import Stats from '../components/Stats';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	deleteWorkoutExercise,
	updateWorkoutExercise,
} from '../redux/slices/workoutsSlice';

type WorkoutDetailsModalProp = StackNavigationProp<
	RootStackParamList,
	'WorkoutDetailsModal'
>;
type WorkoutDetailsModalRouteProp = RouteProp<RootStackParamList, 'WorkoutDetailsModal'>;

export interface Detailes {
	weight: number;
	reps: number;
	volumeLoad: number;
}

const WorkoutDetailsModal = () => {
	const [workout, setWorkout] = useState<Workout | undefined>();
	const navigation = useNavigation<WorkoutDetailsModalProp>();
	const route = useRoute<WorkoutDetailsModalRouteProp>();

	const dispatch = useDispatch();
	const workouts = useSelector((state: RootState) => state.workouts);
	const { data } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const workoutData = workouts.find((e) => e.workoutId === route.params.workoutId);
		if (!workoutData) return;
		navigation.setOptions({
			headerTitle: `${moment(workoutData.createdAt).format('MM/DD/YY')} ${
				workoutData.name ? workoutData.name : 'Workout'
			}`,
		});
		setWorkout(workoutData);
	}, [workouts]);

	const pressUpdate = async () => {
		if (!workout) return;
		let index = workouts.findIndex((e) => e.workoutId === route.params.workoutId);
		// update firebase and redux
		const updated = await updateDbWorkouts(workout);
		dispatch(updateWorkoutExercise({ index, workout }));
		setWorkout(undefined);
		navigation.goBack();
	};
	const pressDelete = () => {
		let index = workouts.findIndex((e) => e.workoutId === route.params.workoutId);
		Alert.alert('Warning!', 'Do you really want to delete this workout?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: async () => {
					// delete from firebase and redux
					const deleted = await deleteDbWorkouts(route.params.workoutId);
					dispatch(deleteWorkoutExercise({ index }));
					setWorkout(undefined);
					navigation.goBack();
				},
			},
		]);
	};

	if (!data || !workout)
		return (
			<ActivityIndicator
				size={50}
				color={colorStyles.gradient2}
				style={globalStyles.absoluteCenter}
			/>
		);
	return (
		<KeyboardAwareScrollView style={{ padding: 10 }}>
			{data && <Stats workout={workout} weightOption={data.options.weight} />}
			{workout && <WorkoutSowcase setWorkout={setWorkout} workout={workout} />}

			<LinearButton onPress={pressUpdate}>
				<Text>Update</Text>
			</LinearButton>
			<TouchableOpacity style={styles.deleteBtn} onPress={() => pressDelete()}>
				<Text>Delete Workout</Text>
			</TouchableOpacity>
		</KeyboardAwareScrollView>
	);
};

export default WorkoutDetailsModal;

const styles = StyleSheet.create({
	deleteBtn: { backgroundColor: colorStyles.danger },
	totalStats: { marginBottom: 20 },
});
