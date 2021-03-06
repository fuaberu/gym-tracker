import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import colorStyles from '../../config/colors';
import globalStyles from '../../config/globalStyles';

interface PasswordInterface {
	setState: (arg0: string) => void;
	state: string;
	setValidation: (boolean: boolean) => void;
}

const InputPassword = ({ setState, state, setValidation }: PasswordInterface) => {
	const [hide, setHide] = useState(true);
	const [isValid, setIsValid] = useState(false);

	const validate = (text: string) => {
		setState(text);
		if (text.length >= 6) {
			setIsValid(true);
			setValidation(true);
		} else {
			setIsValid(false);
			setValidation(false);
		}
	};

	return (
		<View>
			<Text style={globalStyles.textTitleSecondary}>Password</Text>
			<View>
				<View style={globalStyles.iconContainer}>
					<AntDesign name="lock" size={24} color={colorStyles.gradient2} />
				</View>
				<TouchableOpacity onPress={() => setHide(!hide)} style={styles.show}>
					{hide ? (
						<AntDesign name="eyeo" size={24} color={colorStyles.white} />
					) : (
						<AntDesign name="eye" size={24} color={colorStyles.gradient2} />
					)}
				</TouchableOpacity>
				<TextInput
					style={[
						globalStyles.input,
						state
							? isValid
								? { borderColor: colorStyles.success }
								: { borderColor: colorStyles.error }
							: null,
					]}
					placeholder="Password"
					placeholderTextColor={colorStyles.lightGrey}
					onChangeText={(text) => validate(text)}
					value={state}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
					secureTextEntry={hide}
				/>
			</View>
		</View>
	);
};

export default InputPassword;

const styles = StyleSheet.create({
	show: {
		position: 'absolute',
		top: 0,
		right: 12,
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
		zIndex: 1000,
	},
});
