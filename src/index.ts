#!/usr/bin/env node

import { isCancel, note, select } from '@clack/prompts'
import { setupAngular } from './commands/angular.ts'
import { setupCVA } from './commands/cva.ts'
import { setupPrettier } from './commands/prettier.ts'
import { setupTailwind } from './commands/tailwindcss.ts'

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

async function ask() {
	return (
		process.argv[2] ??
		(await select({
			message: 'What would you like to do?',
			options: [
				{ value: 'angular', label: 'Initialize an Angular project' },
				{ value: 'prettier', label: 'Setup Prettier' },
				{ value: 'tailwind', label: 'Setup TailwindCSS' },
				{ value: 'cva', label: 'Setup CVA' },
			],
		}))
	)
}

async function main() {
	let command = await ask()
	while (!isCancel(command)) {
		await commands[command as Command]()
		command = await ask()
	}
	note(`Bye!        `)
	process.exit(0)
}

main().catch(console.error)
