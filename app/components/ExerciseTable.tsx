import React from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import {
	LongPressGestureHandler,
	State,
	Swipeable,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import NumericInput from './small components/NumericInput';
import { AntDesign } from '@expo/vector-icons';
import DivisionLine from './small components/DivisionLine';
import colorStyles from '../config/colors';
import globalStyles from '../config/globalStyles';
import Stats from './Stats';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

interface Set {
	reps: number;
	weight: number;
	[key: string]: number;
}

export interface Exercise {
	exerciseId: string;
	userId: string;
	name: string;
	createdAt: number;
	sets: Set[];
}

interface Props {
	exercise: Exercise;
	tableIndex: number;
	updateExerciseName: (text: string, tableIndex: number) => void;
	addExerciseLine: (index: number) => void;
	deleteLine: (line: number, tableIndex: number) => void;
	onChange: (text: string, lineIndex: number, column: string, tableIndex: number) => void;
	deleteExercise: (tableIndex: number) => void;
}

const ExerciseTable = ({
	exercise,
	tableIndex,
	updateExerciseName,
	addExerciseLine,
	deleteLine,
	onChange,
	deleteExercise,
}: Props) => {
	let swipeRef: Array<any> = [];

	const { data } = useSelector((state: RootState) => state.user);

	const deleteSet = (line: number) => {
		deleteLine(line, tableIndex);
		swipeRef[line].close();
	};

	const deleteTable = (event: { nativeEvent: { state: any } }) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			deleteExercise(tableIndex);
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
			<View style={[styles.container, globalStyles.componentElevated]}>
				<View>
					<TextInput
						value={exercise.name}
						onChangeText={(text) => updateExerciseName(text, tableIndex)}
						style={[styles.text, styles.headline]}
					/>
				</View>

				<DivisionLine />
				{data && <Stats exercise={exercise} weightOption={data.options.weight} />}
				<View>
					{/* table lines */}
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
									<View
										style={{
											flex: 3,
											flexDirection: 'row',
											justifyContent: 'center',
										}}
									>
										<NumericInput
											tableIndex={tableIndex}
											value={value.reps}
											onChange={onChange}
											lineIndex={lineIndex}
											column={'reps'}
										/>
										{value.reps > 0 && (
											<Text
												style={[
													{
														textAlignVertical: 'center',
													},
													globalStyles.textSecondary,
												]}
											>
												{' '}
												reps
											</Text>
										)}
									</View>
									<View
										style={{
											flex: 3,
											flexDirection: 'row',
											justifyContent: 'center',
										}}
									>
										<NumericInput
											tableIndex={tableIndex}
											onChange={onChange}
											value={value.weight}
											lineIndex={lineIndex}
											column={'weight'}
										/>
										{value.weight > 0 && (
											<Text
												style={[
													{
														textAlignVertical: 'center',
													},
													globalStyles.textSecondary,
												]}
											>
												{' '}
												{data?.options.weight}
											</Text>
										)}
									</View>
								</View>
							</Swipeable>
						);
					})}
				</View>
				<View style={styles.addLineContainer}>
					<TouchableOpacity onPress={() => addExerciseLine(tableIndex)}>
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
		paddingHorizontal: 8,
		paddingVertical: 15,
		marginBottom: 25,
		borderRadius: 10,
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
		alignSelf: 'center',
		bottom: -18,
	},
	lineText: {
		color: colorStyles.textPrymary,
		textAlign: 'center',
	},
});
