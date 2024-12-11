import { writeOrUpdateFile } from '../utils/file.ts'
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

			writeOrUpdateFile(
				'tailwind.config.js',
				tailwindConfigContent,
				{
					fileUpdated: 'Tailwind configuration file updated successfully!',
					fileSkipped: 'Tailwind configuration file already exists.',
					fileCreated: 'Tailwind configuration file created successfully!',
				},
				true
			)

			// Prompt the user for the styles.css path
			const stylesPath = await askQuestion(
				'Please specify the path to your styles.css file:',
				'./src/styles.css'
			)
			writeOrUpdateFile(stylesPath, tailwindDirectives, {
				fileUpdated: `Tailwind CSS directives added to existing file: ${stylesPath}`,
				fileSkipped: `The styles.css file already contains Tailwind CSS directives. No changes made.`,
				fileCreated: `New styles.css file created and updated at: ${stylesPath}`,
			})
		} catch (error) {
			console.error(
				`Error during Tailwind CSS initialization: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	} else {
		console.log('Skipping Tailwind configuration.')
	}
}
