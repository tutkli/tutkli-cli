import { confirm } from '@inquirer/prompts'

/**
 * Prompts the user with a yes/no question in the terminal.
 *
 * @param message - The question to ask the user.
 * @returns A promise that resolves to true if the user answers "yes", false otherwise.
 */
export async function askYesNoQuestion(message: string): Promise<boolean> {
	return confirm({ message, default: false })
}
