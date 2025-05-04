import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { PlaybackService } from './src/player/service'
import TrackPlayer from 'react-native-track-player'

AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerComponent('RNCarPlayScene', () => App)

// Register RNTP playback service for remote controls
TrackPlayer.registerPlaybackService(() => PlaybackService)
