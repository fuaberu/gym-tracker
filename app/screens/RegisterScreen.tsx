import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../components/small components/Input';
import InputPassword from '../components/small components/InputPassword';
import LinearButton from '../components/small components/LinearButton';
import { AntDesign } from '@expo/vector-icons';

import colorStyles from '../config/colors';
import { registerUserData } from '../firebase/config';
import { RootStackParamList } from '../../Navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import DivisionLine from '../components/small components/DivisionLine';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';
import MeasureInput from '../components/small components/MeasureInput';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActionBtn from '../components/small components/ActionBtn';

type LoginSceenProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const RegisterScreen = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [emailValid, setEmailValid] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordValid, setPasswordValid] = useState(false);
	const [weight, setWeight] = useState(0);
	const [height, setHeight] = useState(0);

	const navigation = useNavigation<LoginSceenProp>();
	const dispatch = useDispatch();

	const onSignUpPress = async () => {
		if (!email || !password || !name)
			return Alert.alert('Warning!', 'Please fill all empty inputs.');
		if (!passwordValid)
			return Alert.alert('Warning!', 'Password needs to be at least 6 caracheter');
		if (!emailValid) return Alert.alert('Warning!', 'Please fill in with an valid email');

		try {
			//register in firebase
			const docRef = await registerUserData(name, email, password);
			dispatch(setUserData(docRef));
		} catch (e) {
			console.log(e);
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
					<DivisionLine />
					<Input
						label="Full Name"
						icon={<AntDesign name="user" size={24} color={colorStyles.gradient2} />}
						setState={setName}
						state={name}
						placeholder="My name"
					/>
					<Input
						label="Email"
						icon={<AntDesign name="mail" size={24} color={colorStyles.gradient2} />}
						setState={setEmail}
						validation={{ type: 'email', setValidation: setEmailValid }}
						state={email}
						placeholder="myemail@mail.com"
					/>
					<View style={{ flexDirection: 'row' }}>
						<MeasureInput
							label="Weight"
							placeholder={60}
							icon={
								<MaterialCommunityIcons
									name="scale-bathroom"
									size={24}
									color={colorStyles.gradient2}
								/>
							}
							state={weight}
							setState={setWeight}
							option={'kg'}
						/>
						<MeasureInput
							label="Height"
							placeholder={170}
							icon={
								<MaterialCommunityIcons
									name="human-male-height-variant"
									size={24}
									color={colorStyles.gradient2}
								/>
							}
							state={height}
							setState={setHeight}
							option={'cm'}
						/>
					</View>
					<InputPassword
						setState={setPassword}
						setValidation={setPasswordValid}
						state={password}
					/>
					<ActionBtn text="Sign Up" onPress={onSignUpPress} />
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
