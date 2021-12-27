import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../App';
import Input from './Input';
import DivisionLine from './small components/DivisionLine';
import { AntDesign } from '@expo/vector-icons';
import colorStyles from '../config/colors';
import LinearButton from './LinearButton';
import { addExercise, getSuggestions, Suggestions } from '../firebase/config';
import { Exercise } from './ExerciseTable';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NewExerciseModal = () => {
	const [exerciseName, setExerciseName] = useState('');
	const [suggestions, setSuggestions] = useState<Suggestions>([]);
	const [suggested, setSuggested] = useState<Exercise>();

	const user = useSelector((state: RootState) => state.user);

	const onNameChange = async (text: string) => {
		if (!user.data) return;
		setExerciseName(text);
		const suggestionsServer = await getSuggestions(user.data?.userId);
		suggestionsServer && setSuggestions(suggestionsServer);
		console.log('sugges', suggestionsServer);
	};

	const pressCreate = async () => {
		if (!user.data) return;
		if (suggested) {
			//uses a suggestion as base
			await addExercise({
				userId: user.data?.userId,
				name: suggested.name,
				createdAt: new Date(),
				sets: suggested.sets,
			});
		} else {
			//creates a new exercise
			await addExercise({
				userId: user.data?.userId,
				name: exerciseName,
				createdAt: new Date(),
				sets: [{ weight: 0, reps: 10 }],
			});
		}
	};

	const suggestionPress = (suggestion: Exercise) => {
		setSuggested(suggestion);
		setExerciseName(suggestion.name);
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
				<View>
					{suggestions.map((suggestion, index) => {
						<TouchableOpacity onPress={() => suggestionPress(suggestion)} key={index}>
							<Text>{suggestion}</Text>
						</TouchableOpacity>;
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

const styles = StyleSheet.create({});
