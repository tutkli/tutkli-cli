import { showErrorText, showText } from '../../utils/messages.ts'
import { NgManager } from './ng-manager.ts'

/**
 * Asynchronously initializes the creation of a new Angular project.
 *
 * This function prompts the user for various configuration options needed
 * for creating a new Angular project, including project name, style type,
 * and dependency bundling preference. If the user consents to proceed,
 * it executes the Angular CLI `ng new` command using the specified
 * configurations.
 */
export const angularNew = async () => {
	showText(' Angular New ', { bgColor: '#F50D53' })

	const ngManager = new NgManager()

	try {
		await ngManager.prompt()
		const proceed = await ngManager.promptProceed()

		if (!proceed) return

		await ngManager.run()
	} catch (error) {
		showErrorText(
			`Error while generating ng new command: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}
