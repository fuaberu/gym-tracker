import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colorStyles from '../config/colors';

interface Props {
	value: number;
	lineIndex: number;
	column: string;
	tableIndex: number;
	onChange: (text: string, lineIndex: number, column: string, tableIndex: number) => void;
}

const NumericInput = ({ value, lineIndex, column, onChange, tableIndex }: Props) => {
	const [color, setColor] = useState(colorStyles.textPrymary);
	const onFocus = () => {
		setColor(colorStyles.gradient1);
	};
	const onBlur = () => {
		setColor(colorStyles.textPrymary);
	};

	return (
		<TextInput
			maxLength={14}
			keyboardType="numeric"
			value={value !== 0 ? value.toString() : ''}
			onChangeText={(text) => onChange(text, lineIndex, column, tableIndex)}
			onBlur={onBlur}
			onFocus={onFocus}
			style={{ color: color, width: 50 }}
		/>
	);
};

export default NumericInput;

const styles = StyleSheet.create({});
