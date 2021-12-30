import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import colorStyles from '../config/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Calendar from '../components/Calendar';
import { setReduxWorkouts } from '../redux/slices/workoutsSlice';
import { getUserWorkouts, Workout } from '../firebase/config';

type wellcomeScreenProp = StackNavigationProp<RootStackParamList, 'Wellcome'>;

export default function WellcomeScreen() {
	const [message, setMessage] = useState('Wellcome');

	let navigation = useNavigation<wellcomeScreenProp>();

	const { data } = useSelector((state: RootState) => state.user);
	const workouts = useSelector((state: RootState) => state.workouts);

	const onPressSchedule = () => {
		navigation.navigate('Schedule');
	};
	const onPressAddWorkout = () => {
		navigation.navigate('AddWorkout');
	};

	const wellcomeMessage = () => {
		const currentHour = parseFloat(moment().format('HH'));
		if (currentHour >= 12 && currentHour <= 17) {
			setMessage('Good afternoon,');
		} else if (currentHour >= 17) {
			setMessage('Good evening,');
		} else {
			setMessage('Good morning,');
		}
	};

	useEffect(() => {
		wellcomeMessage();
	}, []);

	return (
		<SafeAreaView>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignContent: 'center',
				}}
			>
				<View>
					<Text style={styles.text}>{message}</Text>
					<Text style={styles.text}>{data?.fullname}</Text>
				</View>
				<Image
					source={{
						uri: 'https://isaojose.com.br/wp-content/uploads/2020/12/blank-profile-picture-mystery-man-avatar-973460.jpg',
					}}
					style={{ width: 40, height: 40, borderRadius: 1000 }}
				/>
			</View>
			<Pressable onPress={onPressSchedule}>
				<Text style={styles.text}>go to schedule</Text>
			</Pressable>
			<Pressable onPress={onPressAddWorkout}>
				<Text style={styles.text}>add workout</Text>
			</Pressable>
			{workouts.length > 0 && <Calendar workouts={workouts} />}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	text: { color: colorStyles.textPrymary },
});
