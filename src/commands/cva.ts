import { cancel, confirm, group, intro, outro, text } from '@clack/prompts'
import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
import { showDeps } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'
import { loadingSpinner } from '../utils/spinner.ts'

const CVA_UTIL_CONTENT = `import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx, compose } = defineConfig({
  hooks: {
	onComplete: (className) => twMerge(className),
  },
});`

const deps = ['cva@beta', 'tailwind-merge']

export const setupCVA = async () => {
	intro(chalk.bold.bgHex('#454545').hex('#AAAAAA')`Initializing CVA...`)

	const config = await group(
		{
			path: () =>
				text({
					message: 'Where would you like to add the cva util file?',
					placeholder: './src/utils/cva.ts',
					defaultValue: './src/utils/cva.ts',
				}),
			install: async () => {
				await showDeps(deps)
				return confirm({
					message: 'Proceed with the installation?',
					initialValue: true,
				})
			},
		},
		{
			onCancel: () => {
				cancel('CLI operation cancelled')
				process.exit(0)
			},
		}
	)

	if (!config.install) return

	await loadingSpinner({
		startText: 'Installing dependencies...',
		stopText: 'Dependencies installed',
		fn: () => runInstallCommand(deps, true),
	})
	await loadingSpinner({
		startText: 'Creating CVA util file...',
		stopText: 'CVA util file created',
		fn: () => writeOrUpdateFile(config.path as string, CVA_UTIL_CONTENT),
	})

	outro(chalk.bgHex('#13A10E')`CVA installed successfully!`)
}
