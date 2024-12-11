import { confirm, input } from '@inquirer/prompts'

/**
 * Prompts the user with a yes/no question in the terminal.
 *
 * @param message - The question to ask the user.
 * @returns A promise that resolves to true if the user answers "yes", false otherwise.
 */
export async function askYesNoQuestion(message: string): Promise<boolean> {
	return confirm({ message, default: false })
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
	defaultAnswer: string
): Promise<string> {
	return input({ message, default: defaultAnswer })
}
