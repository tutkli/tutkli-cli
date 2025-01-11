import { log, note } from '@clack/prompts'
import { blue, bold, gray, green } from 'picocolors'
import { getDepsWithVersions } from './npm.ts'

export async function showDeps(deps: string[]) {
	log.info('The following dependencies will be installed:')

	const versionedDeps = await getDepsWithVersions(deps)
	for (const dep of versionedDeps) {
		console.log(`${gray('│  - ')}${blue(bold(dep))}`)
	}
}

export async function showCommand(command: string) {
	log.info('The following command will be run:')
	log.message(blue(bold(command)))
}

export const check = (message: string) => `${green('✓')} ${message}`

export const goodbye = () => note('Bye!        ')
