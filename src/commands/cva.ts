import { confirm, group, intro, outro, tasks, text } from '@clack/prompts'
import { bgBlackBright, green } from 'picocolors'
import { writeOrUpdateFile } from '../utils/file.ts'
import { check, goodbye, showDeps } from '../utils/prompt.ts'
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
	intro(bgBlackBright('  Initializing CVA...  '))

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
				return check('Dependencies installed.')
			},
		},
		{
			title: 'Creating CVA util file...',
			task: () => {
				writeOrUpdateFile(config.path as string, CVA_UTIL_CONTENT)
				return check('CVA util file created.')
			},
		},
	])

	outro(green('CVA installed successfully!'))
}
