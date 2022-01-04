import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colorStyles from '../../config/colors';
import globalStyles from '../../config/globalStyles';

interface InputInterface {
	placeholder?: string;
	label: string;
	setState: (arg0: string) => void;
	state: string;
	icon: JSX.Element;
	validation?: { type: string; setValidation: (boolean: boolean) => void };
}

const Input = ({
	placeholder,
	setState,
	state,
	icon,
	validation,
	label,
}: InputInterface) => {
	const [isValid, setIsValid] = useState(false);

	const emailValidation = () => {
		const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (reg.test(state) === true) {
			setIsValid(true);
			validation?.setValidation(true);
		} else {
			setIsValid(false);
			validation?.setValidation(false);
		}
	};

	const validate = (text: string) => {
		setState(text);
		switch (validation?.type) {
			case 'email':
				emailValidation();
				break;

			default:
				break;
		}
	};
	return (
		<View>
			<Text style={globalStyles.textTitleSecondary}>{label}</Text>
			<View>
				<View style={globalStyles.iconContainer}>{icon}</View>
				<TextInput
					style={[
						globalStyles.input,
						globalStyles.textSecondary,
						validation && state
							? isValid
								? { borderColor: colorStyles.success }
								: { borderColor: colorStyles.error }
							: null,
					]}
					placeholder={placeholder}
					placeholderTextColor={colorStyles.lightGrey}
					onChangeText={(text) => validate(text)}
					value={state}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
				/>
			</View>
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({});
