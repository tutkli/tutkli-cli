import {
	cancel,
	confirm,
	group,
	intro,
	multiselect,
	outro,
} from '@clack/prompts'
import chalk from 'chalk'
import { writeOrUpdateFile } from '../../utils/file.ts'
import { showDeps } from '../../utils/messages.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../../utils/package-json.ts'
import { runInstallCommand } from '../../utils/run-command.ts'
import { clackSpinner } from '../../utils/spinner.ts'

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
	intro(chalk.bold.bgHex('#A04967')`Initializing Prettier...`)

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
				cancel('CLI operation cancelled')
				process.exit(0)
			},
		}
	)

	if (!config.install) return

	await clackSpinner({
		startText: 'Installing dependencies....',
		stopText: 'Dependencies installed',
		fn: () => runInstallCommand(deps(config.plugins ?? []), true),
	})

	await clackSpinner({
		startText: `Adding "prettify" script...`,
		stopText: `Prettify script added`,
		fn: () => addPackageJsonScript('prettify', 'prettier --write .'),
	})

	await clackSpinner({
		startText: `Creating ${chalk.italic(`.prettierrc.json`)} file....`,
		stopText: `${chalk.italic(`.prettierrc.json`)} file created`,
		fn: () =>
			writeOrUpdateFile('.prettierrc.json', prettierrc(config.plugins), true),
	})

	if (config.prettify) {
		await clackSpinner({
			startText: `Running "prettify" script...`,
			stopText: `Ran Prettify script`,
			fn: () => runPackageJsonScript('prettify'),
		})
	}

	outro(chalk.bgHex('#13A10E')`Prettier installed successfully!`)
}
