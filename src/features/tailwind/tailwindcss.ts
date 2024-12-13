import { writeOrUpdateFile } from '../../utils/file.ts'
import {
	showErrorText,
	showSuccessText,
	showText,
} from '../../utils/messages.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { spinner } from '../../utils/spinner.ts'
import { TailwindConfigManager } from './tw-config-manager.ts'
import { TailwindStyleManager } from './tw-style-manager.ts'

export const setupTailwind = async (): Promise<void> => {
	showText(' TailwindCSS ', { bgColor: '#2982AF', color: '#E2E8F0' })

	const styleManager = new TailwindStyleManager()
	const configManager = new TailwindConfigManager()

	// Prompts
	await configManager.promptPlugins()
	const stylesPath = await styleManager.promptStylesPath()
	await styleManager.promptExtraStyles()

	try {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies....',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(configManager.getDeps(), true),
		})

		// Create tailwind config file
		await spinner({
			loadingText: 'Initializing TailwindCSS...',
			successText: 'TailwindCSS initialized',
			fn: () =>
				writeOrUpdateFile(
					'tailwind.config.js',
					configManager.getConfig(),
					true
				),
		})

		// Add tailwind directives
		await spinner({
			loadingText: 'Adding TailwindCSS directive...',
			successText: 'TailwindCSS directives added',
			fn: () => writeOrUpdateFile(stylesPath, styleManager.getContent()),
		})
	} catch (error) {
		showErrorText(
			`Error while setting up TailwindCSS: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	showSuccessText('TailwindCSS installed successfully!')
}
