import 'react-native'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react-native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QueueProvider, useQueueContext } from '../player/queue-provider'
import { Button, Text } from 'react-native'
import { Event } from 'react-native-track-player'
import { eventHandler } from './setup-rntp'

const queryClient = new QueryClient()

const QueueConsumer = () => {
	const { currentIndex, useSkip } = useQueueContext()

	return (
		<>
			<Text testID='current-index'>{currentIndex}</Text>

			<Button title='skip' testID='use-skip' onPress={() => useSkip.mutate(undefined)} />
		</>
	)
}

test(`${QueueProvider.name} renders and functions correctly`, async () => {
	const queueProvider = render(
		<QueryClientProvider client={queryClient}>
			<QueueProvider>
				<QueueConsumer />
			</QueueProvider>
		</QueryClientProvider>,
	)

	const currentIndex = screen.getByTestId('current-index')

	expect(currentIndex.props.children).toBe(-1)

	eventHandler({
		type: Event.PlaybackActiveTrackChanged,
		index: 3,
	})

	await waitFor(() => {
		const updatedIndex = screen.getByTestId('current-index')
		expect(updatedIndex.props.children).toBe(3)
	})
})
