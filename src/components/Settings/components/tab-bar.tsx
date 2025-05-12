import { MaterialTopTabBarProps, MaterialTopTabBar } from '@react-navigation/material-top-tabs'

export default function SettingsTabBar(props: MaterialTopTabBarProps): React.JSX.Element {
	const { state, descriptors, navigation } = props

	return <MaterialTopTabBar {...props} />
}
