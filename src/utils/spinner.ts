import ora from 'ora'

export async function spinner(config: {
	loadingText: string
	successText: string
	fn: () => unknown | (() => Promise<unknown>)
}) {
	const oraSpinner = ora(config.loadingText).start()
	config.fn()
	oraSpinner.color = 'green'
	oraSpinner.succeed(config.successText)
}

export async function asyncSpinner(config: {
	loadingText: string
	successText: string
	fn: () => Promise<unknown>
}) {
	const oraSpinner = ora(config.loadingText).start()
	await config.fn()
	oraSpinner.color = 'green'
	oraSpinner.succeed(config.successText)
}
