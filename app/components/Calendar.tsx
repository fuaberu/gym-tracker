import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import colorStyles from '../config/colors';
import LinearButton from './small components/LinearButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUserWorkouts, Workout } from '../firebase/config';
import { setReduxWorkouts } from '../redux/slices/workoutsSlice';
import globalStyles from '../config/globalStyles';

type wellcomeScreenProp = StackNavigationProp<RootStackParamList, 'Wellcome'>;

const Calendar = ({ workouts }: { workouts: Workout[] }) => {
	const [activeDate, setActiveDate] = useState(new Date());
	const [selectedDay, setSelectedDay] = useState(new Date());

	const navigation = useNavigation<wellcomeScreenProp>();

	let daysMatrix = [];

	//with out leap years
	const numberDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const year = activeDate.getFullYear();
	const month = activeDate.getMonth();

	//the first day of the week
	const firstDay = new Date(year, month, 1).getDay();

	let maxDays = numberDays[month];

	if (month == 1) {
		// February
		if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			//its a leap year
			maxDays += 1;
		}
	}

	const amountOfDivs = maxDays < 31 ? 35 : firstDay < 6 ? 35 : 42;
	//if

	let dayCount = 1;
	for (let i = 0; i < amountOfDivs; i++) {
		if (firstDay <= i && dayCount <= maxDays) {
			let match = workouts?.find(
				//check if there is a workout that day
				(e) =>
					new Date(e.createdAt).getDate() === dayCount &&
					new Date(e.createdAt).getMonth() === month &&
					new Date(e.createdAt).getFullYear() === year
			);
			if (match) {
				daysMatrix.push({
					id: i,
					day: dayCount,
					workoutId: match.workoutId,
					month,
					year,
				});
				dayCount++;
			} else {
				daysMatrix.push({ id: i, day: dayCount, month, year });
				dayCount++;
			}
		} else {
			daysMatrix.push({ id: i, day: 0 });
		}
	}

	const changeMonth = (n: number) => {
		if (n > 0) {
			var futureMonth = moment(activeDate).add(1, 'M');
			var thisMonthEnd = moment(activeDate).endOf('month');
			if (futureMonth.month() !== activeDate.getMonth() + 1) {
				const newDate = moment(activeDate).add(
					thisMonthEnd.date() - activeDate.getDate() + 1,
					'days'
				);
				setActiveDate(newDate.toDate());
			} else {
				setActiveDate(futureMonth.toDate());
			}
		} else {
			let fm = moment(activeDate).subtract(1, 'M');
			setActiveDate(moment(fm).toDate());
		}
	};

	const pressDay = (day: number) => {
		day !== 0 && setSelectedDay(new Date(year, month, day));
	};
	const pressWorkoutDay = (day: number, workoutId: string) => {
		setSelectedDay(new Date(year, month, day));
		navigation.navigate('WorkoutDetailsModal', {
			workoutId: workoutId,
		});
	};

	return (
		<View style={globalStyles.componentElevated}>
			<View style={styles.headerContainer}>
				<TouchableOpacity onPress={() => changeMonth(-1)}>
					<AntDesign name="arrowleft" size={24} color={colorStyles.gradient2} />
				</TouchableOpacity>
				<Text style={styles.text}>{moment(activeDate).format('MMMM YYYY')}</Text>
				<TouchableOpacity onPress={() => changeMonth(1)}>
					<AntDesign name="arrowright" size={24} color={colorStyles.gradient2} />
				</TouchableOpacity>
			</View>
			<View style={styles.weekDaysContainer}>
				{weekDays.map((day, index) => {
					return (
						<View style={styles.dayItem} key={index}>
							<Text style={[styles.text]}>{day}</Text>
						</View>
					);
				})}
			</View>
			<View style={styles.daysContainer}>
				<FlatList
					columnWrapperStyle={{ justifyContent: 'space-between' }}
					data={daysMatrix}
					numColumns={7}
					scrollEnabled={false}
					renderItem={({ item }) => (
						<View style={styles.dayItem}>
							{item.workoutId ? (
								<LinearButton
									style={{ width: 35 }}
									onPress={() => pressWorkoutDay(item.day, item.workoutId)}
								>
									<Text style={{ color: '#000' }}>{item.day}</Text>
								</LinearButton>
							) : (
								<TouchableOpacity onPress={() => pressDay(item.day)}>
									<Text
										style={[
											styles.text,
											{
												color:
													item.day === selectedDay.getDate() &&
													item.month === selectedDay.getMonth() &&
													item.year === selectedDay.getFullYear()
														? colorStyles.gradient2
														: colorStyles.textPrymary,
											},
										]}
									>
										{item.day !== 0 ? item.day : ''}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					)}
				/>
			</View>
		</View>
	);
};

export default Calendar;

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 10,
	},
	text: { color: colorStyles.textPrymary },
	weekDaysContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: colorStyles.componentBackground,
		marginHorizontal: -10,
		padding: 10,
	},
	daysContainer: { padding: 10 },
	dayItem: {
		width: '12%',
		alignItems: 'center',
		paddingBottom: 5,
		paddingTop: 5,
	},
});
