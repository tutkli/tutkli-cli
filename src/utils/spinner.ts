import { spinner as cSpinner } from '@clack/prompts'
import ora from 'ora'

export async function spinner(config: {
	loadingText: string
	successText: string
	fn: () => unknown | Promise<unknown>
}) {
	const oraSpinner = ora(config.loadingText).start()

	try {
		const result = config.fn()
		if (result instanceof Promise) {
			await result
		}
		oraSpinner.color = 'green'
		oraSpinner.succeed(config.successText)
	} catch (error) {
		throw error
	}
}

export async function clackSpinner(config: {
	startText: string
	stopText: string
	fn: () => unknown | Promise<unknown>
}) {
	const spinner = cSpinner()
	spinner.start(config.startText)
	const result = config.fn()
	if (result instanceof Promise) {
		await result
	}
	spinner.stop(config.stopText)
}
