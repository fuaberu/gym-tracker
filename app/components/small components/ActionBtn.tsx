import { LinearGradient } from 'expo-linear-gradient';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colorStyles from '../../config/colors';
import globalStyles from '../../config/globalStyles';

const ActionBtn = ({
	text,
	child,
	onPress,
}: {
	text?: string;
	child?: Component;
	onPress: () => void;
}) => {
	return (
		<TouchableOpacity onPress={() => onPress()}>
			<LinearGradient
				colors={[colorStyles.gradient1, colorStyles.gradient2]}
				style={styles.buttonContainer}
			>
				{text && (
					<Text
						style={[
							globalStyles.textPrimary,
							{ alignSelf: 'center', textTransform: 'uppercase' },
						]}
					>
						{text}
					</Text>
				)}
				{child && child}
			</LinearGradient>
		</TouchableOpacity>
	);
};

export default ActionBtn;

const styles = StyleSheet.create({
	buttonContainer: {
		elevation: 8,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginTop: 15,
	},
});
