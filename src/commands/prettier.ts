import {
	confirm,
	group,
	intro,
	multiselect,
	note,
	outro,
	tasks,
} from '@clack/prompts'
import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../utils/package-json.ts'
import { showDeps } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'

const deps = (plugins: string[]) => ['prettier', ...plugins]
const prettierrc = (plugins: string[]) => {
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
		plugins: plugins,
	}
	return JSON.stringify(config, null, 2)
}

export const setupPrettier = async () => {
	intro(chalk.bold.bgHex('#A04967')`  Initializing Prettier...  `)

	const config = await group(
		{
			plugins: () =>
				multiselect({
					message: 'Select the plugins you want to add',
					options: [
						{
							value: 'prettier-plugin-organize-imports',
							label: 'Organize Imports',
						},
						{
							value: 'prettier-plugin-tailwindcss',
							label: 'TailwindCSS',
						},
					],
					initialValues: ['prettier-plugin-organize-imports'],
					cursorAt: 'prettier-plugin-tailwindcss',
				}),
			prettify: () =>
				confirm({
					message: `Would you like to run the ${chalk.italic(`"prettify"`)} script after installation?`,
					initialValue: true,
				}),
			install: async ({ results }) => {
				await showDeps(deps(results.plugins ?? []))
				return confirm({
					message: 'Proceed with the installation?',
					initialValue: true,
				})
			},
		},
		{
			onCancel: () => {
				note(`Bye!        `)
				process.exit(0)
			},
		}
	)

	if (!config.install) return

	await tasks([
		{
			title: 'Installing dependencies...',
			task: async () => {
				await runInstallCommand(deps(config.plugins ?? []), true)
				return `${chalk.green('✓')} Dependencies installed.`
			},
		},
		{
			title: `Adding "prettify" script...`,
			task: () => {
				addPackageJsonScript('prettify', 'prettier --write .')
				return `${chalk.green('✓')} Prettify script added.`
			},
		},
		{
			title: `Creating ${chalk.italic(`.prettierrc.json`)} file....`,
			task: () => {
				writeOrUpdateFile(
					'.prettierrc.json',
					prettierrc(config.plugins ?? []),
					true
				)
				return `${chalk.green('✓')} ${chalk.italic(`.prettierrc.json`)} file created.`
			},
		},
		{
			title: `Running "prettify" script...`,
			task: () => {
				runPackageJsonScript('prettify')
				return `${chalk.green('✓')} Ran Prettify script.`
			},
			enabled: config.prettify,
		},
	])

	outro(chalk.green`Prettier installed successfully!`)
}
