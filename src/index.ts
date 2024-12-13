#!/usr/bin/env node

import { select } from '@inquirer/prompts'
import { setupCVA } from './features/cva/cva.ts'
import { setupPrettier } from './features/prettier/prettier.ts'
import { setupTailwind } from './features/tailwind/tailwindcss.ts'
import { showBanner } from './utils/messages.ts'

const features = {
	prettier: setupPrettier,
	tailwind: setupTailwind,
	cva: setupCVA,
}

type Features = keyof typeof features | 'exit'

let isBannerShown = false

async function ask() {
	if (!isBannerShown) {
		showBanner()
		isBannerShown = true
	}
	console.log('')
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
