import {
	showErrorText,
	showSuccessText,
	showText,
} from '../../utils/messages.ts'
import { CVAConfigManager } from './cva-config-manager.ts'

export const setupCVA = async () => {
	showText(' CVA ', { bgColor: '#454545', color: '#AAAAAA' })

	const configManager = new CVAConfigManager()

	// Prompts
	await configManager.prompt()
	const proceed = await configManager.promptProceed()

	if (!proceed) return

	try {
		await configManager.run()
	} catch (error) {
		showErrorText(
			`Error while setting up CVA: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	showSuccessText('CVA installed successfully!')
}
