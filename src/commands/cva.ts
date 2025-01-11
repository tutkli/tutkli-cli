import { confirm, group, intro, note, outro, tasks, text } from '@clack/prompts'
import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
import {formatter, goodbye, showDeps} from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'

const CVA_UTIL_CONTENT = `import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx, compose } = defineConfig({
  hooks: {
	onComplete: (className) => twMerge(className),
  },
});`

const deps = ['cva@beta', 'tailwind-merge']

export const setupCVA = async () => {
	intro(chalk.bold.bgHex('#454545').hex('#AAAAAA')`  Initializing CVA...  `)

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
				goodbye()
				process.exit(0)
			},
		}
	)

	if (!config.install) return

	await tasks([
		{
			title: 'Installing dependencies...',
			task: async () => {
				await runInstallCommand(deps, true)
				return formatter.check('Dependencies installed.')
			},
		},
		{
			title: 'Creating CVA util file...',
			task: () => {
				writeOrUpdateFile(config.path as string, CVA_UTIL_CONTENT)
				return formatter.check('CVA util file created.')
			},
		},
	])

	outro(formatter.success('CVA installed successfully!'))
}
