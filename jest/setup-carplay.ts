jest.mock('react-native-carplay', () => {
	return {
		ListTemplate: class {
			constructor(config) {
				this.config = config
			}
		},
		NowPlayingTemplate: class {
			constructor(config) {
				this.config = config
			}
		},
		TabBarTemplate: class {
			constructor(config) {
				this.config = config
			}
		},
		checkForConnection: jest.fn(), // if needed as a named export too
	}
})
