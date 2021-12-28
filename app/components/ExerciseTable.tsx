import React from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import {
	LongPressGestureHandler,
	State,
	Swipeable,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import colorStyles from '../config/colors';
import NumericInput from './NumericInput';
import { AntDesign } from '@expo/vector-icons';
import DivisionLine from './small components/DivisionLine';
import { useDispatch } from 'react-redux';
import {
	addLine,
	deleteExercise,
	deleteLine,
	updateName,
} from '../redux/slices/exercisesSlice';

interface Set {
	reps: number;
	weight: number;
	[key: string]: number;
}

export interface Exercise {
	userId: string;
	name: string;
	createdAt: string;
	sets: Set[];
}

interface Props {
	exercise: Exercise;
	tableIndex: number;
}

const ExerciseTable = ({ exercise, tableIndex }: Props) => {
	const dispatch = useDispatch();

	let swipeRef: Array<any> = [];

	const deleteSet = (line: number) => {
		dispatch(deleteLine({ tableIndex, line }));
		swipeRef[line].close();
	};

	const deleteTable = (event: { nativeEvent: { state: any } }) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			dispatch(deleteExercise({ tableIndex }));
		}
	};

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
			<TouchableOpacity style={styles.deleteBox} onPress={() => deleteSet(line)}>
				<Animated.View style={{ transform: [{ scale }] }}>
					<AntDesign name="delete" size={24} color={colorStyles.textPrymary} />
				</Animated.View>
			</TouchableOpacity>
		);
	};

	return (
		<LongPressGestureHandler onHandlerStateChange={deleteTable} minDurationMs={500}>
			<View style={styles.container}>
				<View>
					<TextInput
						value={exercise.name}
						onChangeText={(text) => dispatch(updateName({ text, tableIndex }))}
						style={[styles.text, styles.headline]}
					/>
				</View>

				<DivisionLine />
				<View>
					{/* teble lines */}
					{exercise.sets.map((value, lineIndex) => {
						return (
							<Swipeable
								ref={(ref) => (swipeRef[lineIndex] = ref)}
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
											lineIndex={lineIndex}
											tableIndex={tableIndex}
											column={'reps'}
										/>
									</View>
									<View style={{ flex: 3 }}>
										<NumericInput
											value={value.weight.toString()}
											lineIndex={lineIndex}
											tableIndex={tableIndex}
											column={'weight'}
										/>
									</View>
								</View>
							</Swipeable>
						);
					})}
				</View>
				<View style={styles.addLineContainer}>
					<TouchableOpacity
						style={styles.addLine}
						onPress={() => dispatch(addLine({ index: tableIndex }))}
					>
						<AntDesign name="pluscircle" size={34} color={colorStyles.gradient1} />
					</TouchableOpacity>
				</View>
			</View>
		</LongPressGestureHandler>
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
