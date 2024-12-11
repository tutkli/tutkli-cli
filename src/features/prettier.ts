import { createFile } from '../utils/file.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../utils/package-json.ts'
import { runInstallCommand } from '../utils/run-command'

// Prettier and plugins to install
const prettierDeps = [
	'prettier',
	'prettier-plugin-organize-imports',
	'prettier-plugin-tailwindcss',
]

// Prettier configuration content
const prettierConfig = {
	useTabs: true,
	singleQuote: true,
	semi: false,
	bracketSpacing: true,
	arrowParens: 'avoid',
	trailingComma: 'es5',
	bracketSameLine: true,
	htmlWhitespaceSensitivity: 'ignore',
	printWidth: 80,
	endOfLine: 'auto',
	plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
}

export const setupPrettier = async () => {
	console.log(`Installing Prettier and plugins...`)

	// Run the installation command
	try {
		await runInstallCommand(prettierDeps, true)
	} catch (error) {
		console.error(
			`Error while installing Prettier dependencies: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	// Create the `.prettierrc.json` file
	const prettierConfigString = JSON.stringify(prettierConfig, null, 2)
	createFile('.prettierrc.json', prettierConfigString)

	// Add "prettify" script to package.json
	addPackageJsonScript('prettify', 'prettier --write .')

	console.log('Prettier setup completed successfully!')

	// Prompt the user and run the "prettify" script if confirmed
	try {
		await runPackageJsonScript('prettify', true)
	} catch (error) {
		console.error("An error occurred while running the 'prettify' script.")
	}
}
