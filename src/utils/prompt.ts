import { log } from '@clack/prompts'
import chalk from 'chalk'
import { getDepsWithVersions } from './npm.ts'

export async function showDeps(deps: string[]) {
	log.info('The following dependencies will be installed:')

	const versionedDeps = await getDepsWithVersions(deps)
	for (const dep of versionedDeps) {
		console.log(`${chalk.gray(`│  - `)}${chalk.blue.bold(dep)}`)
	}
}

export async function showCommand(command: string) {
	log.info('The following command will be run:')
	log.message(chalk.blue.bold(command))
}
