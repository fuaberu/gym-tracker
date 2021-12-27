import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colorStyles from '../config/colors';

interface Props {
	value: string;
	onChange: (arg0: string, arg1: number, arg2: number, arg3: string) => void;
	tabelIndex: number;
	lineIndex: number;
	column: string;
}

const NumericInput = ({ value, onChange, tabelIndex, lineIndex, column }: Props) => {
	const [color, setColor] = useState(colorStyles.textPrymary);
	const onFocus = () => {
		setColor(colorStyles.gradient1);
	};
	const onBlur = () => {
		setColor(colorStyles.textPrymary);
	};

	return (
		<TextInput
			keyboardType="numeric"
			value={value}
			onChangeText={(text) => onChange(text, tabelIndex, lineIndex, column)}
			onBlur={onBlur}
			onFocus={onFocus}
			style={{ color: color, width: 50 }}
		/>
	);
};

export default NumericInput;

const styles = StyleSheet.create({});
