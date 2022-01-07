import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import colorStyles from '../config/colors';
import { AntDesign } from '@expo/vector-icons';
import LinearButton from '../components/small components/LinearButton';
import ExerciseTable from '../components/ExerciseTable';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { saveWorkout } from '../firebase/config';
import {
	addLine,
	clearExercises,
	deleteExercise,
	deleteLine,
	updateDate,
	updateExercise,
	updateName,
} from '../redux/slices/exercisesSlice';
import { addWorkout } from '../redux/slices/workoutsSlice';

type addWorkoutScreenProp = StackNavigationProp<RootStackParamList, 'AddWorkout'>;

const AddWorkout = () => {
	const [date, setDate] = useState(new Date());
	const [showDate, setShowDate] = useState(false);
	const [workoutName, setWorkoutName] = useState('');

	const { data } = useSelector((state: RootState) => state.user);
	const exercises = useSelector((state: RootState) => state.exercises);

	const navigation = useNavigation<addWorkoutScreenProp>();

	const dispatch = useDispatch();

	const onDateChange = (event: any, selectedDate: Date) => {
		const currentDate = selectedDate || date;
		setShowDate(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showDatepicker = () => {
		setShowDate(true);
	};

	const openNewModal = () => {
		if (!data) return;
		console.log('open modal');
		navigation.navigate('NewExerciseModal', {
			userId: data.userId,
			date: date.getTime(),
		});
	};

	const pressSave = async () => {
		if (!data) return;
		//set the selected date to all exercises
		dispatch(updateDate({ date: date.getTime() }));
		const workoutUpload = {
			exercises,
			createdAt: date.getTime(),
			userId: data.userId,
			name: workoutName,
		};
		const message = await saveWorkout(
			exercises,
			date.getTime(),
			data.userId,
			workoutName
		);
		Alert.alert('Save data', message);

		//add to workouts redux
		dispatch(addWorkout(workoutUpload));

		//clean data
		dispatch(clearExercises());
		setWorkoutName('');
		setDate(new Date());
	};

	//exercise table functions
	const updateExerciseName = (text: string, tableIndex: number) => {
		dispatch(updateName({ text, tableIndex }));
	};

	const addExerciseLine = (index: number) => {
		dispatch(addLine({ index }));
	};
	const deleteSet = (line: number, tableIndex: number) => {
		dispatch(deleteLine({ tableIndex, line }));
	};
	const deleteTable = (tableIndex: number) => {
		dispatch(deleteExercise({ tableIndex }));
	};

	const onExerciseInputChange = (
		text: string,
		lineIndex: number,
		column: string,
		tableIndex: number
	) => {
		dispatch(updateExercise({ tableIndex, lineIndex, column, text }));
	};

	return (
		<KeyboardAwareScrollView style={{ flex: 1, padding: 10 }}>
			<View style={styles.container}>
				<View>
					{showDate && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							is24Hour={true}
							display="default"
							onChange={(event: any, selectedDate: any) =>
								onDateChange(event, selectedDate)
							}
						/>
					)}

					<Text style={styles.text}>Workout name</Text>

					<TextInput
						style={[styles.text, styles.input]}
						value={workoutName}
						onChangeText={(text) => setWorkoutName(text)}
					/>
					<Text style={styles.text}>When did you workout?</Text>
					<TouchableOpacity
						onPress={showDatepicker}
						style={[styles.dateButton, styles.input]}
					>
						<View style={styles.iconContainer}>
							<AntDesign name="calendar" size={24} color={colorStyles.gradient2} />
						</View>
						<Text style={styles.text}>{moment(date).format('MM/DD/YYYY')}</Text>
					</TouchableOpacity>
					<Text style={styles.text}>Add exercises to your workout</Text>

					{/* map exercises tables */}
					{exercises.map((value, index) => {
						return (
							<ExerciseTable
								exercise={value}
								tableIndex={index}
								onChange={onExerciseInputChange}
								key={index}
								addExerciseLine={addExerciseLine}
								updateExerciseName={updateExerciseName}
								deleteLine={deleteSet}
								deleteExercise={deleteTable}
							/>
						);
					})}

					<TouchableOpacity onPress={() => openNewModal()} style={{ marginTop: 10 }}>
						<LinearGradient
							start={[0, 0.5]}
							end={[1, 0.5]}
							colors={[colorStyles.gradient1, colorStyles.gradient2]}
							style={{ borderRadius: 1000 }}
						>
							<View style={styles.addBtn}>
								<Text style={[styles.text, { textAlign: 'center' }]}>
									Add New Exercise
								</Text>
								<View style={styles.plusIcon}>
									<AntDesign name="pluscircle" size={24} color={colorStyles.gradient2} />
								</View>
							</View>
						</LinearGradient>
					</TouchableOpacity>
				</View>

				<LinearButton style={styles.saveBtn} onPress={pressSave}>
					<Text style={styles.saveBtn}>Save</Text>
				</LinearButton>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default AddWorkout;

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'space-between', marginBottom: 25 },
	input: {
		height: 48,
		borderRadius: 5,
		overflow: 'hidden',
		borderColor: colorStyles.darkGrey,
		backgroundColor: colorStyles.componentBackgroundSecondary,
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 10,
	},
	iconContainer: {
		position: 'absolute',
		top: 0,
		left: 12,
		right: 12,
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
	},
	dateButton: {
		paddingLeft: 40,
		justifyContent: 'center',
	},
	text: {
		color: colorStyles.textPrymary,
	},
	plusIcon: {
		position: 'absolute',
		top: 0,
		right: 10,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		margin: 2,
		backgroundColor: colorStyles.background,
		borderRadius: 1000,
		padding: 10,
	},
	saveBtn: { padding: 10, color: colorStyles.white, fontWeight: 'bold' },
});
