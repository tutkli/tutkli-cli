import { isPromise } from 'node:util/types'
import ora from 'ora'

export async function spinner(config: {
	loadingText: string
	successText: string
	fn: () => unknown
}) {
	const oraSpinner = ora(config.loadingText).start()
	if (isPromise(config.fn)) {
		await config.fn()
	} else {
		config.fn()
	}
	oraSpinner.color = 'green'
	oraSpinner.succeed(config.successText)
}
