#!/usr/bin/env node

import { intro, isCancel, log, outro, select } from '@clack/prompts'
import { setupAngular } from './commands/angular.ts'
import { setupCVA } from './commands/cva.ts'
import { setupPrettier } from './commands/prettier.ts'
import { setupTailwind } from './commands/tailwindcss.ts'
import { goodbye } from './utils/prompt.ts'

const commands = {
	angular: setupAngular,
	prettier: setupPrettier,
	tailwind: setupTailwind,
	cva: setupCVA,
}

type Command = keyof typeof commands

if (!process.argv[2]) {
	console.log(`
████████╗██╗   ██╗████████╗██╗  ██╗██╗     ██╗     ██████╗██╗     ██╗
╚══██╔══╝██║   ██║╚══██╔══╝██║ ██╔╝██║     ██║    ██╔════╝██║     ██║
   ██║   ██║   ██║   ██║   █████╔╝ ██║     ██║    ██║     ██║     ██║
   ██║   ██║   ██║   ██║   ██╔═██╗ ██║     ██║    ██║     ██║     ██║
   ██║   ╚██████╔╝   ██║   ██║  ██╗███████╗██║    ╚██████╗███████╗██║
   ╚═╝    ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═════╝╚══════╝╚═╝
`)
}

main().catch(console.error)

async function main() {
	const argvCommand = process.argv[2]
	if (argvCommand && !(argvCommand in commands)) {
		log.error(`Unknown command: ${argvCommand}`)
	}

	if (argvCommand && argvCommand in commands) {
		await commands[argvCommand as Command]()
	}

	while (true) {
		intro()
		const command = await ask()
		if (isCancel(command)) break

		outro()
		await commands[command as Command]()
	}
	goodbye()
	process.exit(0)
}

async function ask() {
	return await select({
		message: 'What would you like to do?',
		options: [
			{ value: 'angular', label: 'Initialize an Angular project' },
			{ value: 'prettier', label: 'Setup Prettier' },
			{ value: 'tailwind', label: 'Setup TailwindCSS' },
			{ value: 'cva', label: 'Setup CVA' },
		],
	})
}
