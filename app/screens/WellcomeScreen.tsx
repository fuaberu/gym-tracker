import {
	ActivityIndicator,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import colorStyles from '../config/colors';
import globalStyles from '../config/globalStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Calendar from '../components/Calendar';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
		console.log(currentHour);
		if (currentHour >= 12 && currentHour <= 18) {
			setMessage('Good afternoon,');
		} else if (currentHour > 18) {
			setMessage('Good evening,');
		} else if (currentHour > 4) {
			setMessage('Good morning,');
		}
	};

	useEffect(() => {
		wellcomeMessage();
	}, []);

	const openProfile = () => {
		navigation.navigate('Profile');
	};

	if (!data)
		return (
			<ActivityIndicator
				size={50}
				color={colorStyles.gradient2}
				style={globalStyles.absoluteCenter}
			/>
		);

	return (
		<SafeAreaView>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<View>
					<Text style={styles.text}>{message}</Text>
					<Text style={styles.text}>{data?.fullname}</Text>
				</View>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity onPress={openProfile}>
						<Image
							source={{
								uri: 'https://isaojose.com.br/wp-content/uploads/2020/12/blank-profile-picture-mystery-man-avatar-973460.jpg',
							}}
							style={{ width: 40, height: 40, borderRadius: 1000 }}
						/>
					</TouchableOpacity>
					<Text>{`${workouts.length} Workouts`}</Text>
				</View>
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
