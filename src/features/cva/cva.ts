import { writeOrUpdateFile } from '../../utils/file.ts'
import {
	showErrorText,
	showSuccessText,
	showText,
} from '../../utils/messages.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { spinner } from '../../utils/spinner.ts'
import { CVAConfigManager } from './config.manager.ts'

export const setupCVA = async () => {
	showText(' CVA ', { bgColor: '#454545', color: '#AAAAAA' })

	const configManager = new CVAConfigManager()

	// Prompts
	const utilPath = await configManager.promptUtilPath()

	try {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(configManager.getDeps(), false),
		})

		// Create util file
		await spinner({
			loadingText: 'Creating CVA util file...',
			successText: 'CVA util file created',
			fn: () => writeOrUpdateFile(utilPath, configManager.getUtilContent()),
		})
	} catch (error) {
		showErrorText(
			`Error while setting up CVA: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	showSuccessText('CVA installed successfully!')
}
