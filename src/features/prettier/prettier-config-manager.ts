import type { DepPlugin } from '../../types/types.ts'
import { askProceedInstallation, askYesNoQuestion } from '../../utils/prompt.ts'

export class PrettierConfigManager {
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

	public async promptPlugins() {
		for (const plugin of this.plugins) {
			if (plugin.promptMessage === '') continue
			plugin.isEnabled = await askYesNoQuestion(
				plugin.promptMessage,
				plugin.isEnabled
			)
		}
	}

	public async promptRunPrettify() {
		return askYesNoQuestion(
			'Would you like to run the "prettify" script after installation?',
			true
		)
	}

	public async promptProceedInstallation() {
		return askProceedInstallation(this.getDeps())
	}

	public getDeps() {
		const pluginDeps = this.plugins
			.filter(plugin => plugin.isEnabled)
			.map(plugin => plugin.dependency)
		return ['prettier', ...pluginDeps]
	}

	public getConfig() {
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
