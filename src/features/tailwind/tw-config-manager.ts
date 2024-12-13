import type { DepPlugin } from '../../types/types.ts'
import { askProceedInstallation, askYesNoQuestion } from '../../utils/prompt.ts'

export class TailwindConfigManager {
	private plugins: DepPlugin[] = []

	public async promptPlugins() {
		for (const plugin of this.plugins) {
			if (plugin.promptMessage === '') continue
			plugin.isEnabled = await askYesNoQuestion(
				plugin.promptMessage,
				plugin.isEnabled
			)
		}
	}

	public async promptProceedInstallation() {
		return askProceedInstallation(this.getDeps())
	}

	public getDeps() {
		const plugins = this.plugins
			.filter(plugin => plugin.isEnabled)
			.map(plugin => plugin.dependency)
		return ['tailwindcss', ...plugins]
	}

	public getConfig() {
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
