import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { store } from './app/redux/store';
import { Provider } from 'react-redux';
import Navigation from './Navigation';

//ignore timer warnings
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
	return (
		<Provider store={store}>
			<Navigation />
		</Provider>
	);
}

const styles = StyleSheet.create({});
