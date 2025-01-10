import type { CLIManager, DepPlugin } from '../../types/types.ts'
import { writeOrUpdateFile } from '../../utils/file.ts'
import { askProceedInstallation, askYesNoQuestion } from '../../utils/prompt.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { spinner } from '../../utils/spinner.ts'

export class TailwindConfigManager implements CLIManager {
	private plugins: DepPlugin[] = []

	public async prompt(): Promise<void> {
		await this.promptPlugins()
	}

	public promptProceed(): Promise<boolean> {
		return this.promptProceedInstallation()
	}

	public async run(): Promise<void> {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies....',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(this.getDeps(), true),
		})

		// Create tailwind config file
		await spinner({
			loadingText: 'Initializing TailwindCSS...',
			successText: 'TailwindCSS initialized',
			fn: () => writeOrUpdateFile('tailwind.config.js', this.getConfig(), true),
		})
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

	private async promptProceedInstallation() {
		return askProceedInstallation(this.getDeps())
	}

	private getDeps() {
		const plugins = this.plugins
			.filter(plugin => plugin.isEnabled)
			.map(plugin => plugin.dependency)
		return ['tailwindcss', ...plugins]
	}

	private getConfig() {
		const config = {
			content: ['./src/**/*.{html,ts}'],
			darkMode: 'class',
			theme: {
				extend: {},
			},
			plugins: this.plugins
				.filter(plugin => plugin.isEnabled)
				.map(plugin => plugin.dependency),
		}
		return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)}`
	}
}
