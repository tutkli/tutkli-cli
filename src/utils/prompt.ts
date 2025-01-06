import { confirm, input } from '@inquirer/prompts'
import { showDeps } from './messages.ts'

/**
 * Prompts the user with a yes/no question in the terminal.
 *
 * @param message - The question to ask the user.
 * @param defaultAnswer - The default answer if the user doesn't give one
 * @returns A promise that resolves to true if the user answers "yes", false otherwise.
 */
export async function askYesNoQuestion(
	message: string,
	defaultAnswer = false
): Promise<boolean> {
	return confirm({ message, default: defaultAnswer })
}

/**
 * Prompts the user with a question in the terminal.
 *
 * @param message - The question to ask the user.
 * @param defaultAnswer - The default answer if the user doesn't give one
 * @returns A promise that resolves with the user answer.
 */
export async function askQuestion(
	message: string,
	defaultAnswer?: string
): Promise<string> {
	return input({ message, default: defaultAnswer })
}

/**
 * Prompts the user to proceed with installation after displaying a set of dependencies.
 *
 * @param deps - An array of dependencies that will be shown to the user.
 * @returns A promise that resolves to `true` if the user agrees to proceed, or `false` otherwise.
 */
export async function askProceedInstallation(deps: string[]) {
	await showDeps(deps)
	return askYesNoQuestion('Proceed with installation?', true)
}
