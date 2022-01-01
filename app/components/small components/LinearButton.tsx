import { LinearGradient } from 'expo-linear-gradient';
import { ReactChild } from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colorStyles from '../../config/colors';

const LinearButton = ({
	onPress,
	children,
	style,
}: {
	children: ReactChild;
	onPress: () => void;
	style?: any;
}) => {
	return (
		<TouchableOpacity onPress={() => onPress()} style={style}>
			<LinearGradient
				colors={[colorStyles.gradient1, colorStyles.gradient2]}
				style={styles.button}
				start={[0, 0.5]}
				end={[1, 0.5]}
			>
				{children}
			</LinearGradient>
		</TouchableOpacity>
	);
};

export default LinearButton;

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});
