import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../Navigation';
import Input from './Input';
import DivisionLine from './small components/DivisionLine';
import { AntDesign } from '@expo/vector-icons';
import colorStyles from '../config/colors';
import LinearButton from './LinearButton';
import { getSuggestions, Suggestions } from '../firebase/config';
import { Exercise } from './ExerciseTable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addNewExercise } from '../redux/slices/exercisesSlice';

type NewExerciseModalScreenProp = StackNavigationProp<
	RootStackParamList,
	'NewExerciseModal'
>;
type NewExerciseModalScreenRouteProp = RouteProp<RootStackParamList, 'NewExerciseModal'>;

const NewExerciseModal = () => {
	const [exerciseName, setExerciseName] = useState('');
	const [suggestions, setSuggestions] = useState<Suggestions>([]);
	const [suggested, setSuggested] = useState<Exercise | null>(null);

	let navigation = useNavigation<NewExerciseModalScreenProp>();
	const route = useRoute<NewExerciseModalScreenRouteProp>();

	const dispatch = useDispatch();

	const onNameChange = async (text: string) => {
		setExerciseName(text);
		setSuggested(null);
		const suggestionsServer = await getSuggestions(route.params.userId, text);
		if (!suggestionsServer) return setSuggestions([]);
		setSuggestions(suggestionsServer);
	};

	const pressCreate = async () => {
		if (!route.params.userId) return;
		const timestamp = new Date().getTime();
		if (suggested) {
			//uses a suggestion as base
			dispatch(
				addNewExercise({
					name: suggested.name,
					userId: route.params.userId,
					createdAt: timestamp,
					sets: suggested.sets,
				})
			);
			navigation.goBack();
		} else {
			//creates a new exercise
			dispatch(
				addNewExercise({
					userId: route.params.userId,
					name: exerciseName,
					createdAt: timestamp,
					sets: [{ weight: 0, reps: 10 }],
				})
			);
			navigation.goBack();
		}
	};

	const suggestionPress = (suggestion: Exercise) => {
		setSuggested(suggestion);
		setExerciseName(suggestion.name);
		setSuggestions([]);
	};

	return (
		<View style={{ flex: 1 }}>
			<View>
				<Text>Add a new Exercise</Text>
				<DivisionLine />
				<Input
					icon={<AntDesign name="search1" size={24} color={colorStyles.gradient2} />}
					setState={onNameChange}
					state={exerciseName}
					label="Exercise Name"
				/>
				<View style={styles.suggestionsContainer}>
					{suggestions.map((suggestion, index) => {
						return (
							<TouchableOpacity
								style={styles.suggestion}
								onPress={() => suggestionPress(suggestion)}
								key={index}
							>
								<Text style={styles.text}>{suggestion.name}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
			<LinearButton onPress={() => pressCreate()}>
				<Text>Create</Text>
			</LinearButton>
		</View>
	);
};

export default NewExerciseModal;

const styles = StyleSheet.create({
	text: { color: colorStyles.textPrymary },
	suggestionsContainer: {
		position: 'absolute',
		top: 110,
		left: 20,
		right: 20,
		elevation: 1,
		backgroundColor: colorStyles.componentBackground,
	},
	suggestion: {
		backgroundColor: colorStyles.componentBackgroundSecondary,
		marginBottom: 5,
		padding: 10,
		elevation: 2,
		zIndex: 1,
	},
});
