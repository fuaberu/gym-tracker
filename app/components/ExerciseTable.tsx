import React from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import colorStyles from '../config/colors';
import NumericInput from './NumericInput';
import { AntDesign } from '@expo/vector-icons';
import DivisionLine from './small components/DivisionLine';

interface Set {
	reps: number;
	weight: number;
	[key: string]: number;
}

export interface Exercise {
	name: string;
	weightType: string;
	sets: Set[];
}

interface Props {
	exercise: Exercise;
	tabelIndex: number;
	addLine: (arg0: number) => void;
	deleteLine: (arg0: number, arg1: number) => void;
	updateExercises: (arg0: string, arg1: number, arg2: number, arg3: string) => void;
	updateName: (arg0: string, arg1: number) => void;
}

const ExerciseTable = ({
	exercise,
	tabelIndex,
	addLine,
	updateExercises,
	updateName,
	deleteLine,
}: Props) => {
	const LeftSwipe = ({
		progress,
		dragAnimatedValue,
		line,
	}: {
		progress: Animated.AnimatedInterpolation;
		dragAnimatedValue: Animated.AnimatedInterpolation;
		line: number;
	}) => {
		const scale = dragAnimatedValue.interpolate({
			inputRange: [0, 50],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		});
		return (
			<TouchableOpacity
				style={styles.deleteBox}
				onPress={() => deleteLine(tabelIndex, line)}
			>
				<Animated.View style={{ transform: [{ scale }] }}>
					<AntDesign name="delete" size={24} color={colorStyles.textPrymary} />
				</Animated.View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<View>
				<TextInput
					value={exercise.name}
					onChangeText={(text) => updateName(text, tabelIndex)}
					style={[styles.text, styles.headline]}
				/>
			</View>

			<DivisionLine />
			<View>
				{/* teble lines */}
				{exercise.sets.map((value, lineIndex) => {
					return (
						<Swipeable
							key={lineIndex}
							renderLeftActions={(progress, dragAnimatedValue) => (
								<LeftSwipe
									progress={progress}
									dragAnimatedValue={dragAnimatedValue}
									line={lineIndex}
								/>
							)}
						>
							<View style={styles.lineTable}>
								<View style={styles.setStyle}>
									<Text style={[styles.lineText, styles.setTextStyle]}>{`Set ${
										lineIndex + 1
									}`}</Text>
								</View>
								<View style={{ flex: 3 }}>
									<NumericInput
										value={value.reps.toString()}
										onChange={updateExercises}
										lineIndex={lineIndex}
										tabelIndex={tabelIndex}
										column={'reps'}
									/>
								</View>
								<View style={{ flex: 3 }}>
									<NumericInput
										value={value.weight.toString()}
										onChange={updateExercises}
										lineIndex={lineIndex}
										tabelIndex={tabelIndex}
										column={'weight'}
									/>
								</View>
							</View>
						</Swipeable>
					);
				})}
			</View>
			<View style={styles.addLineContainer}>
				<TouchableOpacity style={styles.addLine} onPress={() => addLine(tabelIndex)}>
					<AntDesign name="pluscircle" size={34} color={colorStyles.gradient1} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ExerciseTable;

const styles = StyleSheet.create({
	deleteBox: {
		backgroundColor: colorStyles.danger,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 3,
		marginBottom: 3,
		height: 40,
		width: 50,
	},
	container: {
		padding: 8,
		marginBottom: 25,
		borderRadius: 10,
		backgroundColor: colorStyles.componentBackgroundSecondary,

		shadowColor: colorStyles.componentBackground,
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 10.32,

		elevation: 16,
	},
	setStyle: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	setTextStyle: {
		backgroundColor: colorStyles.gradient2,
		color: colorStyles.background,
		flex: 0.5,
		textAlign: 'center',
		borderRadius: 1000,
		paddingLeft: 2,
		paddingRight: 2,
	},
	lineTable: {
		flexDirection: 'row',
		backgroundColor: colorStyles.componentBackground,
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: 3,
		marginBottom: 3,
		height: 40,
	},
	text: {
		color: colorStyles.textPrymary,
	},
	headline: { textAlign: 'center' },
	addLineContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -17,
		justifyContent: 'center',
	},
	addLine: { alignItems: 'center' },
	lineText: {
		color: colorStyles.textPrymary,
		textAlign: 'center',
	},
});
