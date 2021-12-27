import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import colorStyles from '../config/colors';
import { AntDesign } from '@expo/vector-icons';
import LinearButton from '../components/LinearButton';
import ExerciseTable from '../components/ExerciseTable';
import { Exercise } from '../components/ExerciseTable';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const dummyState = [
	{
		userId: 'ncajn',
		name: 'Leg Press',
		createdAt: new Date(),
		sets: [
			{ reps: 20, weight: 250 },
			{ reps: 10, weight: 250 },
		],
	},
];

type addWorkoutScreenProp = StackNavigationProp<RootStackParamList, 'AddWorkout'>;

const AddWorkout = () => {
	const [date, setDate] = useState(new Date());
	const [showDate, setShowDate] = useState(false);

	const [exercises, setExercises] = useState<Exercise[]>(dummyState);

	const [newExerciseName, setNewExerciseName] = useState('');

	let navigation = useNavigation<addWorkoutScreenProp>();

	const user = useSelector((state: RootState) => state.user);

	const onChange = (event: any, selectedDate: Date) => {
		const currentDate = selectedDate || date;
		setShowDate(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showDatepicker = () => {
		setShowDate(true);
	};

	const addLine = (index: number) => {
		const newExercises = [...exercises];

		console.log('addLne', newExercises);
		//new line data from the last input
		const newLineReps =
			newExercises[index].sets[newExercises[index].sets.length - 1].reps || 0;
		const newLineWeight =
			newExercises[index].sets[newExercises[index].sets.length - 1].weight || 0;

		//new line object
		const newLine = {
			reps: newLineReps,
			weight: newLineWeight,
		};

		//add to the previous table
		newExercises[index].sets = [...newExercises[index].sets, newLine];
		setExercises([...newExercises]);
	};

	const updateExercises = (
		text: string,
		tabelIndex: number,
		lineIndex: number,
		column: string
	) => {
		const newExercises = [...exercises];

		newExercises[tabelIndex].sets[lineIndex][column] = parseInt(text);
		setExercises([...newExercises]);
	};

	const updateName = (text: string, tabelIndex: number) => {
		const newExercises = [...exercises];

		newExercises[tabelIndex].name = text;

		setExercises((prev) => [...newExercises]);
	};

	const addNewExercise = () => {
		if (!user.data) return;
		const newExercise = {
			userId: user.data?.userId,
			name: newExerciseName,
			createdAt: new Date(),
			weightType: 'kg',
			sets: [{ reps: 0, weight: 0 }],
		};

		setExercises((prev) => [...prev, newExercise]);
	};

	const openNewModal = () => {
		navigation.navigate('NewExerciseModal');
	};

	const deleteExercise = (table: number, line: number) => {
		const newExercises = [...exercises];

		newExercises[table].sets.splice(line, 1);

		console.log('delete', newExercises);

		setExercises([...newExercises]);
	};

	const pressSave = () => {};

	return (
		<KeyboardAwareScrollView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View>
					{showDate && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							is24Hour={true}
							display="default"
							onChange={(event: any, selectedDate: any) => onChange(event, selectedDate)}
						/>
					)}
					<Text style={styles.text}>When did you workout?</Text>
					<TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
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
								addLine={addLine}
								tabelIndex={index}
								key={index}
								updateExercises={updateExercises}
								updateName={updateName}
								deleteLine={deleteExercise}
							/>
						);
					})}

					<TouchableOpacity onPress={() => openNewModal()}>
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

				<LinearButton onPress={pressSave}>
					<Text>Save</Text>
				</LinearButton>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default AddWorkout;

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'space-between', marginBottom: 25 },
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
		height: 48,
		borderRadius: 5,
		overflow: 'hidden',
		borderColor: colorStyles.darkGrey,
		backgroundColor: colorStyles.componentBackgroundSecondary,
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 10,
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
});
