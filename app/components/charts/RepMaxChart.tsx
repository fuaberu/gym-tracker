import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import colorStyles from '../../config/colors';
import globalStyles from '../../config/globalStyles';
import DivisionLine from '../small components/DivisionLine';
import { LineChart } from 'react-native-chart-kit';
import { getExercise } from '../../firebase/config';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const RepMaxChart = ({
	userId,
	exerciseName,
}: {
	userId: string;
	exerciseName: string[];
}) => {
	const [data, setData] =
		useState<{ exerciseValues: number[]; exerciseDates: string[] }>();
	const [name, setName] = useState(0);

	const createOneRepStats = async () => {
		const exerciseDates: string[] = [];
		const exerciseValues: number[] = [];
		// get exercise data from firebase
		const exercise = await getExercise(userId, exerciseName[name]);

		let lastExercise;

		exercise?.forEach((e, index) => {
			let oneRm = 0;
			e.sets.forEach((s) => {
				let BrzyckiValue = s.weight / (1.0278 - 0.0278 * s.reps);
				if (BrzyckiValue > oneRm) oneRm = Math.round(BrzyckiValue);
			});

			if (index === exercise.length - 1) lastExercise = e.createdAt; //get the last one to compare to today

			if (exerciseDates.some((date) => date === moment(e.createdAt).format('DD/MM'))) {
				//if that day had more than one exercise push the highest oneRm
				let dateIndex = exerciseDates.indexOf(moment(e.createdAt).format('DD/MM'));
				if (exerciseValues[dateIndex] < oneRm) {
					//if oneRm is greater subistitute it
					exerciseValues.splice(dateIndex, 1, oneRm);
				}
			} else {
				exerciseValues.push(oneRm);
				exerciseDates.push(moment(e.createdAt).format('DD/MM'));
			}
		});

		if (moment(lastExercise).isBefore(moment())) {
			//if there were no exercise today or after today repeate previous day
			exerciseValues.push(exerciseValues[exerciseValues.length - 1]);
			exerciseDates.push(moment().format('DD/MM'));
		}
		setData({ exerciseValues, exerciseDates });
	};

	useEffect(() => {
		createOneRepStats();
	}, [userId, exerciseName, name]);

	const changeExercise = () => {
		if (name < exerciseName.length) {
			setName(name + 1);
		} else {
			setName(0);
		}
		console.log(exerciseName, name);
	};

	if (!data)
		//return the spinner if there is no user data
		return (
			<ActivityIndicator
				size={50}
				color={colorStyles.gradient2}
				style={globalStyles.absoluteCenter}
			/>
		);

	const line = {
		labels: data.exerciseDates,
		datasets: [
			{
				data: data.exerciseValues,
				strokeWidth: 2,
			},
		],
	};

	return (
		<View style={globalStyles.componentElevated}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={globalStyles.textTitleSecondary}>Best 1RM</Text>
				<TouchableOpacity onPress={changeExercise}>
					<Text style={globalStyles.textTitleSecondary}>{exerciseName[name]}</Text>
				</TouchableOpacity>
			</View>
			<DivisionLine />
			<LineChart
				data={line}
				width={Dimensions.get('window').width - 40} // from react-native
				height={180}
				fromZero={true}
				yAxisSuffix={' kg'}
				chartConfig={{
					backgroundGradientFrom: colorStyles.gradient2,
					backgroundGradientTo: colorStyles.gradient1,
					decimalPlaces: 0,
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16,
				}}
			/>
		</View>
	);
};

export default RepMaxChart;

const styles = StyleSheet.create({});
