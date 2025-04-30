import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QueueProvider } from '../src/player/queue-provider'
import { PlayerProvider } from '../src/player/player-provider'
import { View } from 'react-native'

const queryClient = new QueryClient()

test(`${PlayerProvider.name} renders correctly`, () => {
	render(
		<QueryClientProvider client={queryClient}>
			<QueueProvider>
				<PlayerProvider>
					<View />
				</PlayerProvider>
			</QueueProvider>
		</QueryClientProvider>,
	)
})
