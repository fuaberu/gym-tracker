import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../components/Input';
import InputPassword from '../components/InputPassword';
import LinearButton from '../components/LinearButton';
import { AntDesign } from '@expo/vector-icons';

import colorStyles from '../config/colors';
import { loginUser } from '../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import DivisionLine from '../components/small components/DivisionLine';

type LoginSceenProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [emailValid, setEmailValid] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordValid, setPasswordValid] = useState(false);

	const navigation = useNavigation<LoginSceenProp>();

	const dispatch = useDispatch();

	const onSignUpPress = () => {
		navigation.navigate('SignUp');
	};

	const onLoginPress = async () => {
		if (!email || !password)
			return Alert.alert('Warning!', 'Please fill all empty inputs.');
		if (!passwordValid)
			return Alert.alert('Warning!', 'Password needs to be at least 6 caracheter');
		if (!emailValid) return Alert.alert('Warning!', 'Please fill in with an valid email');

		const user = await loginUser(email, password);
		dispatch(setUserData(user));
		navigation.navigate('Wellcome');
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
					<Text style={styles.title}>LOGIN</Text>
					<DivisionLine />
					<Input
						icon={<AntDesign name="mail" size={24} color={colorStyles.gradient2} />}
						setState={setEmail}
						validation={{ type: 'email', setValidation: setEmailValid }}
						state={email}
						placeholder="Email"
					/>
					<InputPassword
						setState={setPassword}
						setValidation={setPasswordValid}
						state={password}
					/>
					<LinearButton onPress={() => onLoginPress()}>
						<Text>Log in</Text>
					</LinearButton>
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
