import {
	showErrorText,
	showSuccessText,
	showText,
} from '../../utils/messages.ts'
import { TailwindConfigManager } from './tw-config-manager.ts'
import { TailwindStyleManager } from './tw-style-manager.ts'

export const setupTailwind = async (): Promise<void> => {
	showText(' TailwindCSS ', { bgColor: '#2982AF', color: '#E2E8F0' })

	const styleManager = new TailwindStyleManager()
	const configManager = new TailwindConfigManager()

	try {
		await configManager.prompt()
		await styleManager.prompt()
		const proceed = await configManager.promptProceed()

		if (!proceed) return

		await configManager.run()
		await styleManager.run()
	} catch (error) {
		showErrorText(
			`Error while setting up TailwindCSS: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	showSuccessText('TailwindCSS installed successfully!')
}
