import { confirm, group, intro, note, outro, select, text } from '@clack/prompts'
import type { DetectResult } from 'package-manager-detector'
import { resolveCommand } from 'package-manager-detector/commands'
import { bgRed, gray } from 'picocolors'
import { x } from 'tinyexec'
import { detectPm } from '../utils/pm.ts'
import { showCommand } from '../utils/prompt.ts'

const getNgNew = (options: {
	pm: DetectResult
	name: string
	style: string
	bun: boolean
}) =>
	resolveCommand(options.bun ? 'bun' : options.pm.agent, 'execute', [
		'@angular/cli',
		'new',
		options.name,
		'--minimal',
		'--ssr',
		'false',
		'--style',
		options.style,
		'--experimental-zoneless',
		'--package-manager',
		options.bun ? 'bun' : options.pm.agent
	])

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

				const ngNew = getNgNew({
					pm,
					name: results.name,
					style: results.style,
					bun: results.bun
				})

				if (ngNew) showCommand(`${ngNew.command}${ngNew.args.join(' ')}`)

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

	const ngNew = getNgNew({
		pm,
		name: prompts.name,
		style: prompts.style,
		bun: prompts.bun
	})

	if (ngNew) {
		await x(ngNew.command, ngNew.args, {
			nodeOptions: { stdio: 'inherit' },
			throwOnError: true
		})
	}

	const startCommand = resolveCommand(prompts.bun ? 'bun' : pm.agent, 'run', ['start'])

	note(
		`cd ./${prompts.name}        \n${startCommand?.command} ${startCommand?.args.join(' ')}`,
		'Next steps.'
	)
	process.exit(0)
}
