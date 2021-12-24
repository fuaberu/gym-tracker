import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colorStyles from '../config/colors';
import { AntDesign } from '@expo/vector-icons';

interface PasswordInterface {
	setState: (arg0: string) => void;
	state: string;
}

const InputPassword = ({ setState, state }: PasswordInterface) => {
	const [hide, setHide] = useState(false);
	return (
		<View>
			<Text style={styles.text}>Password</Text>
			<View>
				<View style={styles.iconContainer}>
					<AntDesign name="lock" size={24} color={colorStyles.gradient2} />
				</View>
				<TouchableOpacity onPress={() => setHide(!hide)} style={styles.show}>
					{hide ? (
						<AntDesign name="eye" size={24} color={colorStyles.gradient2} />
					) : (
						<AntDesign name="eyeo" size={24} color={colorStyles.white} />
					)}
				</TouchableOpacity>
				<TextInput
					style={styles.input}
					placeholder="Password"
					placeholderTextColor={colorStyles.lightGrey}
					onChangeText={(text) => setState(text)}
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
	show: {
		position: 'absolute',
		top: 0,
		right: 12,
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
		zIndex: 1000,
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
