import { showErrorText, showText } from '../../utils/messages.ts'
import { runCommand } from '../../utils/run-command.ts'
import { NgManager } from './ng-manager.ts'

export const angularNew = async () => {
	showText(' Angular New ')

	const ngManager = new NgManager()

	try {
		// Prompts
		await ngManager.promptProjectName()
		await ngManager.promptStyleType()
		await ngManager.promptBun()

		const proceed = await ngManager.promptProceed()

		if (!proceed) return

		// Run ng new
		try {
			await runCommand(ngManager.getNgNewCommand(), true)
		} catch (error) {
			showErrorText(`Error while running ng new`)
		}
	} catch (error) {
		showErrorText(
			`Error while generating ng new command: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}
