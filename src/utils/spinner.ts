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
