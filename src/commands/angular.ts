import { confirm, group, intro, note, select, text } from '@clack/prompts'
import { bgRed } from 'picocolors'
import {
	detectPackageManager,
	packageManagerRun,
} from '../utils/package-manager.ts'
import { showCommand } from '../utils/prompt.ts'
import { runCommand } from '../utils/run-command.ts'

const ngNewCommand = (options: { name: string; style: string; bun: boolean }) =>
	`ng new ${options.name} --minimal --ssr false --style ${options.style} ${
		options.bun ? '--package-manager bun' : ''
	} --experimental-zoneless`

/**
 * Asynchronously initializes the creation of a new Angular project.
 *
 * This function prompts the user for various configuration options needed
 * for creating a new Angular project, including project name, style type,
 * and package manager of preference. If the user consents to proceed,
 * it executes the Angular CLI `ng new` command using the specified
 * configurations.
 */
export const setupAngular = async () => {
	intro(bgRed(`  Initializing Angular...  `))

	const prompts = await group(
		{
			name: () =>
				text({
					message: 'What is the name of your project?',
					placeholder: 'my-project',
					validate: value => {
						if (!value) return 'Project name cannot be empty'
					},
				}),
			style: () =>
				select({
					message: 'Which stylesheet format would you like to use?',
					options: [
						{ value: 'css', label: 'CSS' },
						{ value: 'scss', label: 'SCSS' },
					],
					initialValue: 'css',
				}),
			bun: () =>
				confirm({
					message: 'Would you like to use bun as package manager?',
					initialValue: true,
				}),
			install: async ({ results }) => {
				if (
					results.name === undefined ||
					results.style === undefined ||
					results.bun === undefined
				)
					return false
				await showCommand(
					ngNewCommand({
						name: results.name,
						style: results.style,
						bun: results.bun,
					})
				)
				return confirm({
					message: 'Proceed with the installation?',
					initialValue: true,
				})
			},
		},
		{
			onCancel: () => {
				note('Bye!        ')
				process.exit(0)
			},
		}
	)

	if (!prompts.install) return

	await runCommand(
		ngNewCommand({
			name: prompts.name,
			style: prompts.style,
			bun: prompts.bun,
		}),
		true
	)

	note(
		`cd ./${prompts.name}        \n${prompts.bun ? packageManagerRun.bun : packageManagerRun[detectPackageManager()]} start`,
		'Next steps.'
	)
	process.exit(0)
}
