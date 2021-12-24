import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colorStyles from '../config/colors';

interface InputInterface {
	placeholder: string;
	setState: (arg0: string) => void;
	state: string;
	icon: JSX.Element;
}

const Input = ({ placeholder, setState, state, icon }: InputInterface) => {
	return (
		<View>
			<Text style={styles.text}>{placeholder}</Text>
			<View>
				<View style={styles.iconContainer}>{icon}</View>
				<TextInput
					style={styles.input}
					placeholder={placeholder}
					placeholderTextColor={colorStyles.lightGrey}
					onChangeText={(text) => setState(text)}
					value={state}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
				/>
			</View>
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	text: {
		color: colorStyles.grey,
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
	input: {
		height: 48,
		borderRadius: 1000,
		overflow: 'hidden',
		borderColor: colorStyles.darkGrey,
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 10,
		paddingLeft: 40,
	},
});
