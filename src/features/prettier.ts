import { writeOrUpdateFile } from '../utils/file.ts'
import { showErrorText, showSuccessText, showText } from '../utils/messages.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../utils/package-json.ts'
import { askYesNoQuestion } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command'
import { asyncSpinner, spinner } from '../utils/spinner.ts'

type PrettierPlugin = {
	dependency: string
	promptMessage: string
	isEnabled: boolean
}

const createPluginRegistry = (): PrettierPlugin[] => [
	{
		dependency: 'prettier-plugin-organize-imports',
		promptMessage: '',
		isEnabled: true,
	},
	{
		dependency: 'prettier-plugin-tailwindcss',
		promptMessage: 'Would you like to install the TailwindCSS plugin?',
		isEnabled: false,
	},
]

const promptForPlugins = async (plugins: PrettierPlugin[]) => {
	for (const plugin of plugins) {
		if (plugin.promptMessage === '') continue
		plugin.isEnabled = await askYesNoQuestion(
			plugin.promptMessage,
			plugin.isEnabled
		)
	}
	return plugins
}

const getPrettierDeps = (plugins: PrettierPlugin[]) => {
	const pluginDeps = plugins
		.filter(plugin => plugin.isEnabled)
		.map(plugin => plugin.dependency)
	return ['prettier', ...pluginDeps]
}

const getPrettierConfig = (plugins: PrettierPlugin[]) => {
	const config = {
		useTabs: true,
		singleQuote: true,
		semi: false,
		bracketSpacing: true,
		arrowParens: 'avoid',
		trailingComma: 'es5',
		bracketSameLine: true,
		htmlWhitespaceSensitivity: 'ignore',
		printWidth: 80,
		endOfLine: 'auto',
		plugins: plugins
			.filter(plugin => plugin.isEnabled)
			.map(plugin => plugin.dependency),
	}
	return JSON.stringify(config, null, 2)
}

export const setupPrettier = async () => {
	showText(' Prettier ', { bgColor: '#A04967' })

	const pluginRegistry = createPluginRegistry()
	await promptForPlugins(pluginRegistry)

	const runPrettify = await askYesNoQuestion(
		'Would you like to run the "prettify" script after installation?',
		true
	)

	try {
		// Install dependencies
		await asyncSpinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(getPrettierDeps(pluginRegistry), true),
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
				writeOrUpdateFile(
					'.prettierrc.json',
					getPrettierConfig(pluginRegistry),
					true
				),
		})

		if (runPrettify) {
			// Run prettify script
			await asyncSpinner({
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
