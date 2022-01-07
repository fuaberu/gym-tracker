import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native';
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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import RepMaxChart from '../components/charts/RepMaxChart';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
//ignore warnings
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

type wellcomeScreenProp = StackNavigationProp<RootStackParamList, 'Wellcome'>;

export default function WellcomeScreen() {
	const [message, setMessage] = useState('Wellcome');
	const [exerciseChart, setExerciseChart] = useState<string[]>([]);

	const { data } = useSelector((state: RootState) => state.user);
	const workouts = useSelector((state: RootState) => state.workouts);

	let navigation = useNavigation<wellcomeScreenProp>();

	const onPressAddWorkout = () => {
		navigation.navigate('AddWorkout');
	};

	const wellcomeMessage = () => {
		const currentHour = moment().hours();
		if (currentHour >= 12 && currentHour <= 18) {
			setMessage('Good afternoon,');
		} else if (currentHour > 18 || currentHour < 4) {
			setMessage('Good evening,');
		} else if (currentHour >= 4) {
			setMessage('Good morning,');
		}
	};

	const getMostFrequentExercises = () => {
		if (!workouts) return;
		setExerciseChart([]);
		let exercisesNames: [string, number][] = [];
		let mapObj: { [key: string]: number } = {}; //map with how many  times the key repeats
		workouts.forEach((w) =>
			w.exercises.forEach((e) => {
				//if key exists add 1 else set to 1
				mapObj[e.name] ? mapObj[e.name]++ : (mapObj[e.name] = 1);
			})
		);
		for (const key in mapObj) {
			//create an array
			exercisesNames.push([key, mapObj[key]]);
		}
		exercisesNames.sort((a: [string, number], b) => b[1] - a[1]);

		exercisesNames.forEach(
			(e, i) => i < 3 && setExerciseChart((prev) => [...prev, e[0]])
		);
	};

	useEffect(() => {
		getMostFrequentExercises();
	}, [workouts]);

	useEffect(() => {
		wellcomeMessage();
	}, []);

	const openProfile = () => {
		navigation.navigate('Profile');
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

	return (
		<SafeAreaView style={{ padding: 10, flex: 1 }}>
			<ScrollView>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View>
						<Text style={globalStyles.textTitleSecondary}>{message}</Text>
						<Text style={globalStyles.textTitleMain}>{data.fullname}</Text>
					</View>
					<View style={{ alignItems: 'center' }}>
						<TouchableOpacity onPress={openProfile}>
							<Image
								source={
									data.profilePic
										? { uri: data.profilePic }
										: require('../assets/default_pfp.jpg')
								}
								style={{ width: 40, height: 40, borderRadius: 1000 }}
							/>
						</TouchableOpacity>
						<Text
							style={globalStyles.textSecondary}
						>{`${workouts.length} Workouts`}</Text>
					</View>
				</View>
				{exerciseChart.length > 0 && data.userId && (
					<RepMaxChart userId={data.userId} exerciseName={exerciseChart} />
				)}
				<View>
					<Calendar workouts={workouts} />
				</View>
			</ScrollView>
			<View style={styles.addBtn}>
				<TouchableOpacity style={styles.pressableAddBtn} onPress={onPressAddWorkout}>
					<LinearGradient
						colors={[colorStyles.gradient1, colorStyles.gradient2]}
						style={styles.buttonContainer}
					>
						<AntDesign name="plus" size={24} color={colorStyles.black} />
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	addBtn: {
		alignSelf: 'center',
		position: 'absolute',
		bottom: 15,
		zIndex: 15,
		elevation: Platform.OS === 'android' ? 50 : 0,
	},
	pressableAddBtn: {
		backgroundColor: colorStyles.gradient1,
		borderRadius: 50,
		shadowColor: colorStyles.white,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	buttonContainer: {
		elevation: 8,
		borderRadius: 50,
		padding: 10,
	},
});
