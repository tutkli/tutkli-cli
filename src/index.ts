#!/usr/bin/env bun

import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import { setupCVA } from './features/cva.ts'
import { setupPrettier } from './features/prettier'
import { setupTailwind } from './features/tailwindcss.ts'

const banner = `
 ______        __    __     __   _        _____   __    ____
/_  __/ __ __ / /_  / /__  / /  (_)      / ___/  / /   /  _/
 / /   / // // __/ /  '_/ / /  / /      / /__   / /__ _/ /  
/_/    \\_,_/ \\__/ /_/\\_\\ /_/  /_/       \\___/  /____//___/  
Welcome to the Tutkli CLI!`

const features = {
	prettier: setupPrettier,
	tailwind: setupTailwind,
	cva: setupCVA,
}

type Features = keyof typeof features | 'exit'

async function ask() {
	console.log(chalk.blue(banner))
	let selectedFeature: Features = await select({
		message: 'Which package would you like to install?',
		choices: [
			{ name: 'Prettier', value: 'prettier' },
			{ name: 'TailwindCSS', value: 'tailwind' },
			{ name: 'CVA', value: 'cva' },
			{ name: 'Exit', value: 'exit' },
		],
		loop: true,
	})

	return selectedFeature
}

try {
	let answer = await ask()
	while (answer !== 'exit') {
		await features[answer]()
		answer = await ask()
	}
} catch (error) {
	if (error instanceof Error && error.name === 'ExitPromptError') {
		// noop; silence this error
	} else {
		throw error
	}
}
