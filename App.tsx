import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import WellcomeScreen from './app/screens/WellcomeScreen';
import { useEffect, useState } from 'react';
import colorStyles from './app/config/colors';

const Stack = createStackNavigator();

export interface UserData {
	userId: string;
	email: string;
	fullname: string;
}

export default function App() {
	const [user, setUser] = useState(null);

	const getUser = async () => {
		//from the local storage
		// try {
		// 	const jsonValue = await AsyncStorage.getItem('user');
		// 	if (jsonValue) setUser(JSON.parse(jsonValue));
		// } catch (e) {
		// 	// error reading value
		// }
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{user ? (
					<Stack.Screen
						name="Wellcome"
						component={WellcomeScreen}
						options={{ headerShown: false }}
					/>
				) : (
					<>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Sign Up"
							component={RegisterScreen}
							options={{
								headerStyle: styles.headerStyle,
								headerTintColor: '#fff',
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
