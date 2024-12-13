import { writeOrUpdateFile } from '../../utils/file.ts'
import {
	showErrorText,
	showSuccessText,
	showText,
} from '../../utils/messages.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../../utils/package-json.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { spinner } from '../../utils/spinner.ts'
import { PrettierConfigManager } from './prettier-config-manager.ts'

export const setupPrettier = async () => {
	showText(' Prettier ', { bgColor: '#A04967' })

	const configManager = new PrettierConfigManager()

	// Prompts
	await configManager.promptPlugins()
	const runPrettify = await configManager.promptRunPrettify()
	const proceed = await configManager.promptProceedInstallation()

	if (!proceed) return

	try {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(configManager.getDeps(), true),
		})

		// Add prettify script
		await spinner({
			loadingText: 'Adding "prettify" script...',
			successText: 'Prettify script added',
			fn: () => addPackageJsonScript('prettify', 'prettier --write .'),
		})

		// Create .prettierrc.json file
		await spinner({
			loadingText: 'Creating .prettierrc.json file....',
			successText: '.prettierrc.json file created',
			fn: () =>
				writeOrUpdateFile('.prettierrc.json', configManager.getConfig(), true),
		})

		if (runPrettify) {
			// Run prettify script
			await spinner({
				loadingText: 'Running "prettify" script...',
				successText: 'Ran Prettify script',
				fn: () => runPackageJsonScript('prettify'),
			})
		}
	} catch (error) {
		showErrorText(
			`Error while setting up Prettier: ${error instanceof Error ? error.message : String(error)}`
		)
	}

	showSuccessText('Prettier installed successfully!')
}
