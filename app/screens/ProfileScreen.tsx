import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';
import { updateUser, uplpoadUserPic } from '../firebase/config';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigation';
import { useNavigation } from '@react-navigation/native';
import ActionBtn from '../components/small components/ActionBtn';

type ProfileSceenProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
	const { data } = useSelector((state: RootState) => state.user);
	if (!data)
		return (
			<ActivityIndicator
				size={50}
				color={colorStyles.gradient2}
				style={globalStyles.absoluteCenter}
			/>
		);
	const [fullname, setFullname] = useState(data.fullname);
	const [email, setEmail] = useState(data.email);
	const [weight, setWeight] = useState(data.weight);
	const [height, setHeight] = useState(data.height);
	const [profilePic, setProfilePic] = useState(data.profilePic);

	const [image, setImage] = useState<ImagePicker.ImageInfo>();
	const [uploading, setUploading] = useState(false);

	const navigation = useNavigation<ProfileSceenProp>();

	const updateData = async () => {
		setUploading(true);
		if (image) {
			setUploading(true);
			const { uri } = image;
			const filename = uri.substring(uri.lastIndexOf('/') + 1);
			const response = await fetch(uri);
			const blob = await response.blob();
			console.log(filename, image);

			const downloadUrl = await uplpoadUserPic(filename, blob);
			if (!downloadUrl) {
				Alert.alert(
					'Error',
					'Profile piicture could not be updated, please try again later'
				);
			} else {
				setProfilePic(downloadUrl);
				await updateUser(data.userId, {
					fullname,
					email,
					weight,
					height,
					profilePic: downloadUrl,
				});
			}
			setUploading(false);
		} else {
			const newUser = await updateUser(data.userId, {
				fullname,
				email,
				weight,
				height,
			});
			setUploading(false);
		}
	};

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.cancelled) {
			setImage(result);
			setProfilePic(result.uri);
		}
	};

	const pressSettings = () => {
		navigation.navigate('SettingsModal');
	};

	const deleteAccount = () => {};
	return (
		<View style={{ padding: 10 }}>
			{uploading && (
				<View style={styles.uploading}>
					<ActivityIndicator
						size={50}
						color={colorStyles.gradient2}
						style={globalStyles.absoluteCenter}
					/>
				</View>
			)}
			<View
				style={{
					alignItems: 'center',
					paddingVertical: 15,
				}}
			>
				<View style={{ width: 80, height: 80, borderRadius: 100 }}>
					<TouchableOpacity onPress={() => pickImage()}>
						<Image
							source={
								profilePic ? { uri: profilePic } : require('../assets/default_pfp.jpg')
							}
							style={{ width: 80, height: 80, borderRadius: 100 }}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.settingsBtn}>
					<TouchableOpacity
						style={{ flexDirection: 'row' }}
						onPress={() => pressSettings()}
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
				<ActionBtn text="Update" onPress={updateData} />
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
	uploading: {
		margin: -10,
		backgroundColor: 'rgba(0,0,0,0.7)',
		elevation: 50,
		zIndex: 50,
		flex: 1,
	},
});
