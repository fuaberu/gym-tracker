import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import colorStyles from '../config/colors';
import globalStyles from '../config/globalStyles';
import DivisionLine from '../components/small components/DivisionLine';
import Input from '../components/small components/Input';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MeasureInput from '../components/small components/MeasureInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearButton from '../components/small components/LinearButton';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
	const { data } = useSelector((state: RootState) => state.user);
	const [unitOptions, setUnitOptions] = useState();
	const [fullname, setFullname] = useState('');
	const [email, setEmail] = useState('');
	const [weight, setWeight] = useState(0);
	const [height, setHeight] = useState(0);

	if (!data)
		return (
			<ActivityIndicator
				size={50}
				color={colorStyles.gradient2}
				style={globalStyles.absoluteCenter}
			/>
		);

	const updateData = () => {};
	const deleteAccount = () => {};
	return (
		<View style={{ padding: 10 }}>
			<View
				style={{
					alignItems: 'center',
					paddingVertical: 15,
				}}
			>
				<View style={{ width: 80, height: 80, borderRadius: 100 }}>
					<TouchableOpacity onPress={() => console.log('click')}>
						<Image
							source={
								data.profilePic ? data.profilePic : require('../assets/default_pfp.jpg')
							}
							style={{ width: 80, height: 80, borderRadius: 100 }}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.settingsBtn}>
					<TouchableOpacity
						style={{ flexDirection: 'row' }}
						onPress={() => console.log('here')}
					>
						<AntDesign name="setting" size={35} color={colorStyles.gradient2} />
					</TouchableOpacity>
				</View>
			</View>
			<View style={globalStyles.componentElevated}>
				<Text style={globalStyles.textTitleMain}>Personal Info</Text>
				<DivisionLine />
				<Input
					label="Full Name"
					icon={<AntDesign name="user" size={24} color={colorStyles.gradient2} />}
					placeholder={data.fullname}
					state={fullname}
					setState={setFullname}
				/>
				<Input
					label="Email"
					icon={<AntDesign name="mail" size={24} color={colorStyles.gradient2} />}
					placeholder={data.email}
					state={email}
					setState={setEmail}
				/>
				<View style={{ flexDirection: 'row' }}>
					<MeasureInput
						label="Weight"
						placeholder={data.weight}
						icon={
							<MaterialCommunityIcons
								name="scale-bathroom"
								size={24}
								color={colorStyles.gradient2}
							/>
						}
						state={weight}
						setState={setWeight}
						option={data.options.weight}
					/>
					<MeasureInput
						label="Height"
						placeholder={data.height}
						icon={
							<MaterialCommunityIcons
								name="human-male-height-variant"
								size={24}
								color={colorStyles.gradient2}
							/>
						}
						state={height}
						setState={setHeight}
						option={data.options.length}
					/>
				</View>
				<TouchableOpacity onPress={updateData}>
					<LinearGradient
						colors={[colorStyles.gradient1, colorStyles.gradient2]}
						style={styles.buttonContainer}
					>
						<Text
							style={[
								globalStyles.textPrimary,
								{ alignSelf: 'center', textTransform: 'uppercase' },
							]}
						>
							Update
						</Text>
					</LinearGradient>
				</TouchableOpacity>
				<TouchableOpacity onPress={deleteAccount}>
					<LinearGradient
						colors={[colorStyles.danger, colorStyles.error]}
						style={[styles.buttonContainer]}
					>
						<Text
							style={[
								globalStyles.textPrimary,
								{ alignSelf: 'center', textTransform: 'uppercase' },
							]}
						>
							Delete Account
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	settingsBtn: {
		position: 'absolute',
		top: 10,
		right: 10,
		width: 35,
		height: 35,
		borderRadius: 100,
	},
	buttonContainer: {
		elevation: 8,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginTop: 15,
	},
});
