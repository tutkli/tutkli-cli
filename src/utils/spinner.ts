import { spinner } from '@clack/prompts'

export async function loadingSpinner(config: {
	startText: string
	stopText: string
	fn: () => unknown | Promise<unknown>
}) {
	const s = spinner()
	s.start(config.startText)
	const result = config.fn()
	if (result instanceof Promise) {
		await result
	}
	s.stop(config.stopText)
}
