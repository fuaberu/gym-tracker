import 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, StyleSheet } from 'react-native';

import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import WellcomeScreen from './app/screens/WellcomeScreen';
import { useEffect, useState } from 'react';
import { getUserWorkouts, userLogged } from './app/firebase/config';
import { setUserData } from './app/redux/slices/userSlice';
import AddWorkout from './app/screens/AddWorkout';
import NewExerciseModal from './app/modals/NewExerciseModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/redux/store';
import WorkoutDetailsModal from './app/modals/WorkoutDetailsModal';
import colorStyles from './app/config/colors';
import globalStyles from './app/config/globalStyles';

//ignore timer warnings
import { LogBox } from 'react-native';
import { setReduxWorkouts } from './app/redux/slices/workoutsSlice';
import ProfileScreen from './app/screens/ProfileScreen';
import SettingsModal from './app/modals/SettingsModal';
LogBox.ignoreLogs(['Setting a timer']);

export type RootStackParamList = {
	Profile: undefined;
	Wellcome: undefined;
	Schedule: undefined;
	AddWorkout: undefined;
	SignUp: undefined;
	Login: undefined;
	WorkoutDetailsModal: { workoutId: string };
	NewExerciseModal: { userId: string; date: number };
	SettingsModal: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
	const [appLoading, setAppLoading] = useState(true);
	const user = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();

	const getWorkouts = async (userId: string) => {
		if (!userId) return;
		const workoutsData = await getUserWorkouts(userId);

		if (!workoutsData) return;
		//update state
		dispatch(setReduxWorkouts(workoutsData));
	};

	const getUser = async () => {
		const loggedUser = await userLogged();
		if (loggedUser) {
			await getWorkouts(loggedUser.userId);
			dispatch(setUserData(loggedUser));
		}
		setAppLoading(false);
	};

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		setAppLoading(false);
	}, [user]);

	if (appLoading)
		return (
			<ActivityIndicator
				size={50}
				color={colorStyles.gradient2}
				style={globalStyles.absoluteCenter}
			/>
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
							name="Profile"
							component={ProfileScreen}
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
							<Stack.Screen
								name="WorkoutDetailsModal"
								component={WorkoutDetailsModal}
								options={{
									headerStyle: styles.headerStyle,
									headerTintColor: colorStyles.textPrymary,
									title: 'Workout details',
									headerTitleStyle: {
										fontWeight: 'bold',
									},
								}}
							/>
							<Stack.Screen
								name="SettingsModal"
								component={SettingsModal}
								options={{
									headerStyle: styles.headerStyle,
									headerTintColor: colorStyles.textPrymary,
									title: 'Settings',
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
