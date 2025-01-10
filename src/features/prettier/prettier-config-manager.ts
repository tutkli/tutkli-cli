import type { CLIManager, DepPlugin } from '../../types/types.ts'
import { writeOrUpdateFile } from '../../utils/file.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../../utils/package-json.ts'
import { askProceedInstallation, askYesNoQuestion } from '../../utils/prompt.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { spinner } from '../../utils/spinner.ts'

export class PrettierConfigManager implements CLIManager {
	private runPrettify = false
	private plugins: DepPlugin[] = [
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

	public async prompt(): Promise<void> {
		await this.promptPlugins()
		this.runPrettify = await this.promptRunPrettify()
	}

	public promptProceed(): Promise<boolean | symbol> {
		return this.promptProceedInstallation()
	}

	public async run(): Promise<void> {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(this.getDeps(), true),
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
			fn: () => writeOrUpdateFile('.prettierrc.json', this.getConfig(), true),
		})

		if (this.runPrettify) {
			// Run prettify script
			await spinner({
				loadingText: 'Running "prettify" script...',
				successText: 'Ran Prettify script',
				fn: () => runPackageJsonScript('prettify'),
			})
		}
	}

	private async promptPlugins() {
		for (const plugin of this.plugins) {
			if (plugin.promptMessage === '') continue
			plugin.isEnabled = await askYesNoQuestion(
				plugin.promptMessage,
				plugin.isEnabled
			)
		}
	}

	private async promptRunPrettify() {
		return askYesNoQuestion(
			'Would you like to run the "prettify" script after installation?',
			true
		)
	}

	private async promptProceedInstallation() {
		return askProceedInstallation(this.getDeps())
	}

	private getDeps() {
		const pluginDeps = this.plugins
			.filter(plugin => plugin.isEnabled)
			.map(plugin => plugin.dependency)
		return ['prettier', ...pluginDeps]
	}

	private getConfig() {
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
			plugins: this.plugins
				.filter(plugin => plugin.isEnabled)
				.map(plugin => plugin.dependency),
		}
		return JSON.stringify(config, null, 2)
	}
}
