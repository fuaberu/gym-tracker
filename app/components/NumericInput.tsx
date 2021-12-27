import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import colorStyles from '../config/colors';
import { updateExercise } from '../redux/slices/exercisesSlice';
// import { updateExercise } from '../redux/slices/exercisesSlice';

interface Props {
	value: string;
	tableIndex: number;
	lineIndex: number;
	column: string;
}

const NumericInput = ({ value, tableIndex, lineIndex, column }: Props) => {
	const [color, setColor] = useState(colorStyles.textPrymary);
	const onFocus = () => {
		setColor(colorStyles.gradient1);
	};
	const onBlur = () => {
		setColor(colorStyles.textPrymary);
	};
	const dispatch = useDispatch();

	const onChange = (text: string) => {
		dispatch(updateExercise({ tableIndex, lineIndex, column, text }));
	};

	return (
		<TextInput
			keyboardType="numeric"
			value={value}
			onChangeText={(text) => onChange(text)}
			onBlur={onBlur}
			onFocus={onFocus}
			style={{ color: color, width: 50 }}
		/>
	);
};

export default NumericInput;

const styles = StyleSheet.create({});
