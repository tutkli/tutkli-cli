import { text } from '@clack/prompts'
import type { CLIManager } from '../../types/types.ts'
import { writeOrUpdateFile } from '../../utils/file.ts'
import { askProceedInstallation } from '../../utils/prompt.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { spinner } from '../../utils/spinner.ts'

const CVA_UTIL_CONTENT = `import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});`

export class CVAConfigManager implements CLIManager {
	private utilPath: string | symbol = ''

	public async prompt(): Promise<void> {
		this.utilPath = await this.promptUtilPath()
	}

	public promptProceed(): Promise<boolean | symbol> {
		return this.promptProceedInstallation()
	}

	public async run(): Promise<void> {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(this.getDeps(), false),
		})

		// Create util file
		await spinner({
			loadingText: 'Creating CVA util file...',
			successText: 'CVA util file created',
			fn: () => writeOrUpdateFile(this.utilPath as string, CVA_UTIL_CONTENT),
		})
	}

	private promptUtilPath() {
		return text({
			message: 'Where would you like to add the cva util file?',
			defaultValue: './src/utils/cva.ts',
		})
	}

	private async promptProceedInstallation() {
		return askProceedInstallation(this.getDeps())
	}

	private getDeps() {
		return ['cva@beta', 'tailwind-merge']
	}
}
