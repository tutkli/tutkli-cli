#!/usr/bin/env bun

import { select } from '@inquirer/prompts'
import { setupPrettier } from './features/prettier'
import { setupTailwind } from './features/tailwindcss.ts'

const features = {
	prettier: setupPrettier,
	tailwind: setupTailwind,
}

type Features = keyof typeof features | 'exit'

async function ask() {
	let selectedFeature: Features = await select({
		message: 'Which package do you want to install?',
		choices: [
			{ name: 'Prettier', value: 'prettier' },
			{ name: 'TailwindCSS', value: 'tailwind' },
			{ name: 'Exit', value: 'exit' },
		],
		loop: true,
	})

	return selectedFeature
}

try {
	let answer = await ask()
	console.log(answer)
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
