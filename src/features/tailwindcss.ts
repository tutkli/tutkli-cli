import { writeOrUpdateFile } from '../utils/file.ts'
import { showErrorText, showSuccessText, showText } from '../utils/messages.ts'
import { askQuestion, askYesNoQuestion } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'
import { spinner } from '../utils/spinner.ts'

const tailwindDeps = ['tailwindcss']

/**
 * Tailwind configuration content to write to tailwind.config.js
 */
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`

const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`

const tailwindMaterialFixes = `\n.mdc-notched-outline__notch {
  border-style: none;
}
.mat-mdc-icon-button {
  line-height: normal;
}\n`

export const setupTailwind = async (): Promise<void> => {
	showText(' TailwindCSS ', { bgColor: '#2982AF', color: '#E2E8F0' })

	let stylesPath: string = './src/styles.css'
	let hasNgMaterial: boolean = false

	// Prompt the user for the styles.css path
	stylesPath = await askQuestion(
		'Please specify the path to your styles.css file:',
		'./src/styles.css'
	)
	hasNgMaterial = await askYesNoQuestion(
		'Are you using Tailwind alongside Angular Material 3?',
		false
	)

	try {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies....',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(tailwindDeps, true),
		})

		// Create tailwind config file
		await spinner({
			loadingText: 'Initializing TailwindCSS...',
			successText: 'TailwindCSS initialized',
			fn: () => writeOrUpdateFile('tailwind.config.js', tailwindConfig, true),
		})

		// Add tailwind directives
		const styleContent = `${tailwindDirectives}${hasNgMaterial ? tailwindMaterialFixes : ''}`
		await spinner({
			loadingText: 'Adding TailwindCSS directive...',
			successText: 'TailwindCSS directives added',
			fn: () => writeOrUpdateFile(stylesPath, styleContent),
		})
	} catch (error) {
		showErrorText(
			`Error while setting up TailwindCSS: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	showSuccessText('TailwindCSS installed successfully!')
}
