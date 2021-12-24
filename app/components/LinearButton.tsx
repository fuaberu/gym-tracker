import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colorStyles from '../config/colors';

const LinearButton = ({ onPress, text }: { text: string; onPress: () => void }) => {
	return (
		<TouchableOpacity onPress={() => onPress()}>
			<LinearGradient
				colors={[colorStyles.gradient1, colorStyles.gradient2]}
				style={styles.button}
				start={[0, 0.5]}
				end={[1, 0.5]}
			>
				<Text style={styles.text}>{text}</Text>
			</LinearGradient>
		</TouchableOpacity>
	);
};

export default LinearButton;

const styles = StyleSheet.create({
	button: {
		marginLeft: 30,
		marginRight: 30,
		marginTop: 20,
		height: 48,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
