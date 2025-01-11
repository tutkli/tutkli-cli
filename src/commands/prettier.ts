import {
	confirm,
	group,
	intro,
	multiselect,
	outro,
	tasks,
} from '@clack/prompts'
import { bgMagenta, gray, green, italic } from 'picocolors'
import { writeOrUpdateFile } from '../utils/file.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../utils/package-json.ts'
import { check, goodbye, showDeps } from '../utils/prompt.ts'
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
	intro(bgMagenta('  Initializing Prettier...  '))

	const prompts = await group(
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
					message: `Would you like to run the ${italic(`"prettify"`)} script after installation?`,
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
				goodbye()
				process.exit(0)
			},
		}
	)

	if (!prompts.install) {
		outro(gray('Prettier initialization cancelled.'))
		return
	}

	await tasks([
		{
			title: 'Installing dependencies...',
			task: async () => {
				await runInstallCommand(deps(prompts.plugins ?? []), true)
				return check('Dependencies installed.')
			},
		},
		{
			title: `Adding "prettify" script...`,
			task: () => {
				addPackageJsonScript('prettify', 'prettier --write .')
				return check('Prettify script added.')
			},
		},
		{
			title: `Creating ${italic('.prettierrc.json')} file....`,
			task: () => {
				writeOrUpdateFile(
					'.prettierrc.json',
					prettierrc(prompts.plugins ?? []),
					true
				)
				return check(`${italic('.prettierrc.json')} file created.`)
			},
		},
		{
			title: `Running "prettify" script...`,
			task: () => {
				runPackageJsonScript('prettify')
				return check('Ran Prettify script.')
			},
			enabled: prompts.prettify,
		},
	])

	outro(green('Prettier installed successfully!'))
}
