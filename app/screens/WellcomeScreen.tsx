import { Pressable, SafeAreaViewBase, StyleSheet, Text, View } from 'react-native';

export default function WellcomeScreen({ navigation }: any) {
	const onPressHandler = () => {
		navigation.navigate('Login');
	};
	return (
		<View>
			<Text>welcome</Text>
			<Pressable onPress={onPressHandler}>
				<Text>go to login</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({});
