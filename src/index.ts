#!/usr/bin/env node

import { isCancel, select } from '@clack/prompts'
import { setupAngular } from './features/angular/angular.ts'
import { setupCVA } from './features/cva/cva.ts'
import { setupPrettier } from './features/prettier/prettier.ts'
import { setupTailwind } from './features/tailwind/tailwindcss.ts'

const features = {
	angular: setupAngular,
	prettier: setupPrettier,
	tailwind: setupTailwind,
	cva: setupCVA,
}

type Feature = keyof typeof features

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

try {
	let command = await ask()
	while (!isCancel(command)) {
		await features[command as Feature]()
		command = await ask()
	}
	process.exit(0)
} catch (error) {
	if (error instanceof Error && error.name === 'ExitPromptError') {
		// noop; silence this error
	} else {
		throw error
	}
}
