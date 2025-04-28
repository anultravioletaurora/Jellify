jest.mock('../api/client')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-haptic-feedback', () => {
	return {
		default: {
			trigger: jest.fn(),
		},
	}
})

jest.mock('burnt', () => {
	return {
		default: {
			alert: jest.fn(),
		},
	}
})
