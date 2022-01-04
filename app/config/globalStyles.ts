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
		padding: 10,
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
	absoluteCenter: {
		position: 'absolute' as 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	iconContainer: {
		position: 'absolute' as 'absolute',
		top: 0,
		left: 12,
		right: 12,
		bottom: 0,
		flexDirection: 'row' as 'row',
		alignItems: 'center' as 'center',
	},
	input: {
		height: 48,
		borderRadius: 1000,
		borderColor: colorStyles.darkGrey,
		color: colorStyles.textPrymary,
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 10,
		paddingLeft: 40,
	},
};
