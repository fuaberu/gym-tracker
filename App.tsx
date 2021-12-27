import 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { store } from './app/redux/store';
import { Provider } from 'react-redux';

import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import WellcomeScreen from './app/screens/WellcomeScreen';
import { useEffect, useState } from 'react';
import colorStyles from './app/config/colors';
import { userLogged } from './app/firebase/config';
import { UserState } from './app/redux/slices/userSlice';
import SchedulerScreen from './app/screens/SchedulerScreen';
import AddWorkout from './app/screens/AddWorkout';
import NewExerciseModal from './app/components/NewExerciseModal';

//ignore timer warnings
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

export type RootStackParamList = {
	Wellcome: undefined;
	Schedule: undefined;
	AddWorkout: undefined;
	SignUp: undefined;
	Login: undefined;
	NewExerciseModal: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	const [user, setUser] = useState<UserState>();
	const [appLoading, setAppLoading] = useState(true);

	const getUser = async () => {
		try {
			const userData = await userLogged();
			if (userData) {
				setUser({
					loggedIn: true,
					data: {
						userId: userData.userId,
						fullname: userData.fulllname,
						email: userData.email,
						createdAt: userData.createdAt,
						profilePic: userData.profilePic,
						options: { weight: userData.options.weight, length: userData.options.length },
					},
				});
				setAppLoading(false);
			}
		} catch (error) {
			setAppLoading(false);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

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
		<Provider store={store}>
			<NavigationContainer theme={MyTheme}>
				<Stack.Navigator>
					{user ? (
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
		</Provider>
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
