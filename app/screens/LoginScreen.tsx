import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../components/Input';
import InputPassword from '../components/InputPassword';
import LinearButton from '../components/LinearButton';
import { AntDesign } from '@expo/vector-icons';

import colorStyles from '../config/colors';

const LoginScreen = ({ navigation }: any) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSignUpPress = () => {
		navigation.navigate('Sign Up');
	};

	const onLoginPress = () => {};

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
					<Text style={styles.title}>LOGIN</Text>
					<View
						style={{
							borderBottomColor: colorStyles.gradient2,
							borderBottomWidth: 1,
							marginBottom: 5,
						}}
					/>
					<Input
						icon={<AntDesign name="mail" size={24} color={colorStyles.gradient2} />}
						setState={setEmail}
						state={email}
						placeholder="Email"
					/>
					<InputPassword setState={setPassword} state={password} />
					<LinearButton onPress={() => onLoginPress()} text={'Log in'} />
					<View style={styles.footerView}>
						<Text style={styles.footerText}>
							Don't have an account?{' '}
							<Text onPress={onSignUpPress} style={styles.footerLink}>
								Sign up
							</Text>
						</Text>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
};

export default LoginScreen;

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
	footerView: {
		flex: 1,
		alignItems: 'center',
		marginTop: 20,
	},
	footerText: {
		fontSize: 16,
		color: colorStyles.textPrymary,
	},
	footerLink: {
		color: '#788eec',
		fontWeight: 'bold',
		fontSize: 16,
	},
});
