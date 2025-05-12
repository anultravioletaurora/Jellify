import { useEffect, useRef } from 'react'

export function usePreviousValue(value: boolean) {
	const previousValue = useRef(value)

	useEffect(() => {
		previousValue.current = value
	}, [value])

	return previousValue.current
}
