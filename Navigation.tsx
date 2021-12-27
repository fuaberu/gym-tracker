import 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';

import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import WellcomeScreen from './app/screens/WellcomeScreen';
import { useEffect, useState } from 'react';
import colorStyles from './app/config/colors';
import { userLogged } from './app/firebase/config';
import { setUserData, UserState } from './app/redux/slices/userSlice';
import SchedulerScreen from './app/screens/SchedulerScreen';
import AddWorkout from './app/screens/AddWorkout';
import NewExerciseModal from './app/components/NewExerciseModal';

//ignore timer warnings
import { LogBox } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/redux/store';
import { Exercise } from './app/components/ExerciseTable';

LogBox.ignoreLogs(['Setting a timer']);

export type RootStackParamList = {
	Wellcome: undefined;
	Schedule: undefined;
	AddWorkout: undefined;
	SignUp: undefined;
	Login: undefined;
	NewExerciseModal: { userId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
	const [appLoading, setAppLoading] = useState(true);
	const user = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();

	const getUser = async () => {
		const loggedUser = await userLogged();
		if (loggedUser) {
			dispatch(setUserData(loggedUser));
			setAppLoading(false);
			console.log('loggoed in');
		} else {
			setAppLoading(false);
			console.log('NOT loggoed in');
		}
		console.log(user);
	};

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		setAppLoading(false);
	}, [user]);

	if (appLoading)
		return (
			<View>
				<Text>loading</Text>
			</View>
		);

	const MyTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: 'rgb(255, 45, 85)',
			text: colorStyles.textPrymary,
			background: colorStyles.background,
		},
	};

	return (
		<NavigationContainer theme={MyTheme}>
			<Stack.Navigator>
				{user.loggedIn ? (
					<>
						<Stack.Screen
							name="Wellcome"
							component={WellcomeScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Schedule"
							component={SchedulerScreen}
							options={{
								headerStyle: styles.headerStyle,
								headerTintColor: colorStyles.textPrymary,
								headerTitleStyle: {
									fontWeight: 'bold',
								},
							}}
						/>
						<Stack.Screen
							name="AddWorkout"
							component={AddWorkout}
							options={{
								headerStyle: styles.headerStyle,
								headerTintColor: colorStyles.textPrymary,
								headerTitleStyle: {
									fontWeight: 'bold',
								},
							}}
						/>
						<Stack.Group screenOptions={{ presentation: 'modal' }}>
							<Stack.Screen
								name="NewExerciseModal"
								component={NewExerciseModal}
								options={{
									headerStyle: styles.headerStyle,
									headerTintColor: colorStyles.textPrymary,
									title: 'Add new exercise',
									headerTitleStyle: {
										fontWeight: 'bold',
									},
								}}
							/>
						</Stack.Group>
					</>
				) : (
					<>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="SignUp"
							component={RegisterScreen}
							options={{
								headerStyle: styles.headerStyle,
								headerTintColor: colorStyles.textPrymary,
								headerTitleStyle: {
									fontWeight: 'bold',
								},
							}}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	headerStyle: {
		backgroundColor: colorStyles.backgroundLight,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
