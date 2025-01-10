import {
	showErrorText,
	showSuccessText,
	showText,
} from '../../utils/messages.ts'
import { PrettierConfigManager } from './prettier-config-manager.ts'

export const setupPrettier = async () => {
	showText(' Prettier ', { bgColor: '#A04967' })

	const configManager = new PrettierConfigManager()

	try {
		await configManager.prompt()
		const proceed = await configManager.promptProceed()

		if (!proceed) return

		await configManager.run()
	} catch (error) {
		showErrorText(
			`Error while setting up Prettier: ${error instanceof Error ? error.message : String(error)}`
		)
	}

	showSuccessText('Prettier installed successfully!')
}
