import { convertRunTimeTicksToSeconds } from '../../../helpers/runtimeticks'
import { Text } from './text'
import React from 'react'

export function RunTimeSeconds({ children }: { children: number }): React.JSX.Element {
	return <Text bold>{calculateRunTimeFromSeconds(children)}</Text>
}

export function RunTimeTicks({
	children,
}: {
	children?: number | null | undefined
}): React.JSX.Element {
	if (!children) return <Text>0:00</Text>

	const time = calculateRunTimeFromTicks(children)

	return (
		<Text style={{ display: 'block' }} color='$borderColor'>
			{time}
		</Text>
	)
}

function calculateRunTimeFromSeconds(seconds: number): string {
	const runTimeHours = Math.floor(seconds / 3600)
	const runTimeMinutes = Math.floor((seconds % 3600) / 60)
	const runTimeSeconds = Math.floor(seconds % 60)

	return (
		(runTimeHours != 0 ? `${padRunTimeNumber(runTimeHours)}:` : '') +
		(runTimeHours != 0 ? `${padRunTimeNumber(runTimeMinutes)}:` : `${runTimeMinutes}:`) +
		padRunTimeNumber(runTimeSeconds)
	)
}

function calculateRunTimeFromTicks(runTimeTicks: number): string {
	const runTimeTotalSeconds = convertRunTimeTicksToSeconds(runTimeTicks)

	return calculateRunTimeFromSeconds(runTimeTotalSeconds)
}

function padRunTimeNumber(number: number): string {
	if (number >= 10) return `${number}`

	return `0${number}`
}
