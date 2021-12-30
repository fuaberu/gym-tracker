import colorStyles from './colors';

export default {
	componentElevated: {
		backgroundColor: colorStyles.componentBackgroundSecondary,
		shadowColor: colorStyles.black,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.32,
		shadowRadius: 5.46,

		elevation: 9,
		borderRadius: 5,
		padding: 5,
	},
	textPrimary: { color: colorStyles.textPrymary, fontSize: 16 },
	textSecondary: { color: colorStyles.textPrymary, fontSize: 14 },
	textTitleSecondary: {
		color: colorStyles.textPrymary,
		fontSize: 18,
		fontWeight: '500' as 'bold',
	},
	textTitleMain: {
		color: colorStyles.textPrymary,
		fontSize: 20,
		fontWeight: '700' as 'bold',
	},
};
