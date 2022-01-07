import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import colorStyles from '../../config/colors';
import globalStyles from '../../config/globalStyles';

interface MeasureInputInterface {
	label: string;
	setState: (arg0: number) => void;
	state: number;
	icon: JSX.Element;
	option: string;
	placeholder: number;
}

const MeasureInput = ({
	setState,
	state,
	option,
	icon,
	label,
	placeholder,
}: MeasureInputInterface) => {
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [optionToShow, setOptionsToShow] = useState(option);
	const [dataShown, setDataShown] = useState(state);
	const options = option === 'kg' || option === 'lb' ? ['kg', 'lb'] : ['cm', 'ft'];

	const openOptions = () => {
		setOptionsOpen(!optionsOpen);
	};

	const optionPress = (optionPressed: string) => {
		switch (optionPressed) {
			case 'kg':
				optionToShow !== 'kg' && setDataShown(dataShown * 2.205);
				console.log(state, dataShown);
				break;
			case 'lb':
				optionToShow !== 'lb' && setDataShown(dataShown / 2.205);
				break;
			case 'cm':
				optionToShow !== 'cm' && setDataShown(parseFloat((dataShown * 30.48).toFixed(2)));
				break;
			case 'ft':
				optionToShow !== 'ft' && setDataShown(parseFloat((dataShown / 30.48).toFixed(2)));
				break;
		}
		setOptionsToShow(optionPressed);
		setOptionsOpen(false);
		// console.log(placeholder);
	};

	const setNumber = (text: string) => {
		if (!text) {
			setDataShown(0);
			return setState(0);
		}
		if (option === 'kg' || option === 'cm') {
			//kg and cm are the app base measurement units
			setState(parseFloat(parseFloat(text).toFixed(2)));
			setDataShown(parseFloat(parseFloat(text).toFixed(2)));
		} else {
			//its ft or lb
			switch (optionToShow) {
				case 'ft':
					setState(parseFloat((dataShown / 30.48).toFixed(2))); //change to cm
					setDataShown(parseFloat(parseFloat(text).toFixed(2)));
					break;
				case 'lb':
					setState(parseFloat((dataShown / 2.205).toFixed(2))); //change to kg
					setDataShown(parseFloat(parseFloat(text).toFixed(2)));
					break;
				default:
					break;
			}
		}
		console.log(placeholder, dataShown);
	};
	return (
		<View style={{ flex: 1, zIndex: 1 }}>
			<Text style={globalStyles.textTitleSecondary}>{label}</Text>
			<View>
				<View style={globalStyles.iconContainer}>{icon}</View>
				<TextInput
					style={[globalStyles.input, globalStyles.textSecondary]}
					placeholderTextColor={colorStyles.lightGrey}
					onChangeText={(text) => setNumber(text)}
					placeholder={placeholder ? placeholder.toString() : ''}
					keyboardType="numeric"
					value={state !== 0 ? (Math.round(dataShown * 10) / 10).toString() : ''}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
				/>
				<View style={styles.optionDisplay}>
					<View
						style={{
							borderRightWidth: 2,
							borderRightColor: colorStyles.gradient1,
							height: 25,
							marginRight: 10,
						}}
					/>
					<Text style={[globalStyles.textSecondary]}>{optionToShow}</Text>
				</View>
				<View style={styles.arrowPosition}>
					<TouchableOpacity
						onPress={() => openOptions()}
						style={{
							flex: 1,
							width: 70,
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingRight: 12,
						}}
					>
						<MaterialIcons
							name="keyboard-arrow-down"
							size={24}
							color={colorStyles.gradient1}
						/>
					</TouchableOpacity>
				</View>
				{optionsOpen && (
					<View style={styles.optionsContainer}>
						{options.map((el, index) => {
							return (
								<TouchableOpacity
									style={styles.option}
									onPress={() => optionPress(el)}
									key={index}
								>
									<Text style={globalStyles.textPrimary}>{el}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				)}
			</View>
		</View>
	);
};

export default MeasureInput;

const styles = StyleSheet.create({
	optionsContainer: {
		zIndex: 1,
		position: 'absolute',
		top: 60,
		right: 0,
		width: 60,
		backgroundColor: colorStyles.componentBackground,
	},
	option: {
		backgroundColor: colorStyles.componentBackgroundSecondary,
		margin: 2,
		padding: 10,
		elevation: 2,
		zIndex: 1,
	},
	arrowPosition: {
		position: 'absolute',
		top: 10,
		right: 0,
		bottom: 10,
		width: 70,
		zIndex: 2,
		alignItems: 'center',
	},
	optionDisplay: {
		position: 'absolute',
		top: 0,
		right: 45,
		width: 20,
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
	},
});
