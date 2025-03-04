import { confirm, group, intro, note, outro, select, text } from '@clack/prompts'
import { resolveCommand } from 'package-manager-detector/commands'
import { bgRed, gray } from 'picocolors'
import { x } from 'tinyexec'
import { detectPm } from '../utils/pm.ts'
import { showCommand } from '../utils/prompt.ts'
import type { Agent } from '@antfu/install-pkg'

const NG_NEW = 'ng new'
const NG_NEW_ARGS = (options: { name: string; style: string; pm: Agent }) => {
	return [
		options.name,
		'--minimal',
		'--ssr',
		'false',
		'--style',
		options.style,
		'--experimental-zoneless',
		'--package-manager',
		options.pm
	]
}

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
	intro(bgRed('  Initializing Angular...  '))

	const pm = await detectPm()

	const prompts = await group(
		{
			name: () =>
				text({
					message: 'What is the name of your project?',
					placeholder: 'my-project',
					validate: value => {
						if (!value) return 'Project name cannot be empty'
					}
				}),
			style: () =>
				select({
					message: 'Which stylesheet format would you like to use?',
					options: [
						{ value: 'css', label: 'CSS' },
						{ value: 'scss', label: 'SCSS' }
					],
					initialValue: 'css'
				}),
			bun: () =>
				confirm({
					message: 'Would you like to use bun as package manager?',
					initialValue: true
				}),
			install: async ({ results }) => {
				if (results.name === undefined || results.style === undefined || results.bun === undefined)
					return false

				const args = NG_NEW_ARGS({
					name: results.name,
					style: results.style,
					pm: results.bun ? 'bun' : pm.agent
				})
				showCommand(`${NG_NEW} ${args.join(' ')}`)

				return confirm({
					message: 'Proceed with the installation?',
					initialValue: true
				})
			}
		},
		{
			onCancel: () => {
				note('Bye!        ')
				process.exit(0)
			}
		}
	)

	if (!prompts.install) {
		outro(gray('Angular initialization cancelled.'))
		return
	}

	const args = NG_NEW_ARGS({
		name: prompts.name,
		style: prompts.style,
		pm: prompts.bun ? 'bun' : pm.agent
	})
	await x(NG_NEW, args, {
		nodeOptions: { stdio: 'inherit' },
		throwOnError: true
	})

	const startCommand = resolveCommand(prompts.bun ? 'bun' : pm.agent, 'run', ['start'])
	note(
		`cd ./${prompts.name}        \n${startCommand?.command} ${startCommand?.args.join(' ')}`,
		'Next steps.'
	)
	process.exit(0)
}
