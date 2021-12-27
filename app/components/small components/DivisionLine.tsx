import React from 'react';
import { StyleSheet, View } from 'react-native';
import colorStyles from '../../config/colors';

const DivisionLine = () => {
	return (
		<View
			style={{
				borderBottomColor: colorStyles.gradient1,
				borderBottomWidth: 1,
				marginBottom: 5,
				marginTop: 5,
			}}
		/>
	);
};

export default DivisionLine;

const styles = StyleSheet.create({});
