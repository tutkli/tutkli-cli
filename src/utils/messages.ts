import chalk from 'chalk'

export function showText(
	text: string,
	colors?: { bgColor?: string; color?: string }
) {
	console.log(
		chalk.bgHex(colors?.bgColor ?? '#000').hex(colors?.color ?? '#fff')(text)
	)
}

export function showSuccessText(text: string) {
	showText(text, { bgColor: '#13A10E' })
}

export function showErrorText(text: string) {
	console.error(text)
}

export function showBanner() {
	const banner = `
 ______        __    __     __   _        _____   __    ____
/_  __/ __ __ / /_  / /__  / /  (_)      / ___/  / /   /  _/
 / /   / // // __/ /  '_/ / /  / /      / /__   / /__ _/ /  
/_/    \\_,_/ \\__/ /_/\\_\\ /_/  /_/       \\___/  /____//___/
`
	console.log(chalk.blue(banner))
}
