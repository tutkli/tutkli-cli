import fs from 'fs'
import path from 'path'
import { askQuestion, askYesNoQuestion } from '../utils/prompt.ts'
import { runCLICommand, runInstallCommand } from '../utils/run-command.ts'

const tailwindDeps = ['tailwindcss']

/**
 * Tailwind configuration content to write to tailwind.config.js
 */
const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
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

export const setupTailwind = async (): Promise<void> => {
	console.log(`Installing TailwindCSS...`)

	// Run the installation command
	try {
		await runInstallCommand(tailwindDeps, true)
	} catch (error) {
		console.error(
			`Error while installing TailwindCSS dependencies: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	console.log('TailwindCSS installed successfully!')

	// Prompt the user if they want to run tailwind init
	const shouldRunInit = await askYesNoQuestion(
		'Would you like to run `tailwindcss init` to create a Tailwind configuration file?'
	)
	if (shouldRunInit) {
		try {
			console.log('Initializing TailwindCSS...')
			await runCLICommand('tailwindcss init')
			console.log('Tailwind configuration file created successfully!')

			const configPath = path.resolve(process.cwd(), 'tailwind.config.js')
			if (fs.existsSync(configPath)) {
				fs.writeFileSync(configPath, tailwindConfigContent, 'utf8')
				console.log('Tailwind configuration file updated successfully!')
			} else {
				console.error(
					'Error: Unable to find tailwind.config.js after initialization.'
				)
			}

			// Prompt the user for the styles.css path
			const stylesPath = await askQuestion(
				'Please specify the path to your styles.css file:',
				'./src/styles.css'
			)
			addTailwindDirectives(stylesPath)
		} catch (error) {
			console.error(
				`Error during Tailwind CSS initialization: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	} else {
		console.log('Skipping Tailwind configuration.')
	}
}

function addTailwindDirectives(stylesPath: string) {
	const resolvedStylesPath = path.resolve(process.cwd(), stylesPath)

	if (fs.existsSync(resolvedStylesPath)) {
		// Append Tailwind CSS directives if they don't already exist
		const existingContent = fs.readFileSync(resolvedStylesPath, 'utf8')
		if (
			!existingContent.includes('@tailwind base') ||
			!existingContent.includes('@tailwind components') ||
			!existingContent.includes('@tailwind utilities')
		) {
			fs.appendFileSync(resolvedStylesPath, tailwindDirectives)
			console.log(
				`Tailwind CSS directives added to existing file: ${stylesPath}`
			)
		} else {
			console.log(
				`The styles.css file already contains Tailwind CSS directives. No changes made.`
			)
		}
	} else {
		// Create the styles.css file and add Tailwind directives
		fs.mkdirSync(path.dirname(resolvedStylesPath), { recursive: true }) // Ensure any missing directories are created
		fs.writeFileSync(resolvedStylesPath, tailwindDirectives, 'utf8')
		console.log(`New styles.css file created and updated at: ${stylesPath}`)
	}
}
