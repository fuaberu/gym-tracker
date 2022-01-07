import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { signOutUser } from '../firebase/config';
import { logOut } from '../redux/slices/userSlice';

const SettingsModal = () => {
	const dispatch = useDispatch();

	const pressLogOut = async () => {
		await signOutUser();
		dispatch(logOut());
	};
	return (
		<View>
			<View>
				<TouchableOpacity onPress={() => pressLogOut()}>
					<Text>Log Out</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SettingsModal;

const styles = StyleSheet.create({});
