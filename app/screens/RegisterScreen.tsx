import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../components/Input';
import InputPassword from '../components/InputPassword';
import LinearButton from '../components/LinearButton';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colorStyles from '../config/colors';
import { registerUserData } from '../firebase/config';

const RegisterScreen = ({ navigation }: any) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSignUpPress = async () => {
		if (!email || !password || !name) {
			Alert.alert('Warning!', 'Please fill all empty inputs.');
		} else {
			try {
				//register in firebase
				await registerUserData(name, email, password);
				navigation.navigate('Wellcome');
			} catch (e) {
				console.log(e);
			}
		}
	};

	return (
		<View style={styles.container}>
			<KeyboardAwareScrollView
				style={{
					flex: 1,
					width: '100%',
				}}
				keyboardShouldPersistTaps="always"
			>
				<View style={styles.form}>
					<Text style={styles.title}>SIGN UP</Text>
					<View
						style={{
							borderBottomColor: colorStyles.gradient2,
							borderBottomWidth: 1,
							marginBottom: 5,
						}}
					/>
					<Input
						icon={<AntDesign name="user" size={24} color={colorStyles.gradient2} />}
						setState={setName}
						state={name}
						placeholder="Full Name"
					/>
					<Input
						icon={<AntDesign name="mail" size={24} color={colorStyles.gradient2} />}
						setState={setEmail}
						state={email}
						placeholder="Email"
					/>
					<InputPassword setState={setPassword} state={password} />
					<LinearButton onPress={() => onSignUpPress()} text={'Sign Up'} />
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: colorStyles.background,
	},
	form: {
		margin: 15,
		padding: 20,
		backgroundColor: colorStyles.backgroundLight,
		borderRadius: 20,
		shadowColor: colorStyles.black,
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 10.32,

		elevation: 16,
	},
	title: {
		fontSize: 20,
		color: colorStyles.gradient2,
		textAlign: 'center',
		letterSpacing: 3,
		fontWeight: 'bold',
		margin: 5,
	},
});
