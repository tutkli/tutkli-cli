import chalk from 'chalk'
import { getDepsWithVersions } from './npm.ts'

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

export async function showDeps(deps: string[]) {
	console.log('The following dependencies will be installed:')
	const versionedDeps = await getDepsWithVersions(deps)
	for (const dep of versionedDeps) {
		console.log(chalk.blue.bold(dep))
	}
}

export async function showCommand(command: string) {
	console.log('The following command will be run:')
	console.log(chalk.blue.bold(command))
}
