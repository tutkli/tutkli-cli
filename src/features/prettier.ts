import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
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
const prettierConfig = `{
\t"useTabs": true,
\t"singleQuote": true,
\t"semi": false,
\t"bracketSpacing": true,
\t"arrowParens": "avoid",
\t"trailingComma": "es5",
\t"bracketSameLine": true,
\t"htmlWhitespaceSensitivity": "ignore",
\t"printWidth": 80,
\t"endOfLine": "auto",
\t"plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"]
}`

export const setupPrettier = async () => {
	console.log(chalk.bgYellow.black('Setting up Prettier and plugins...'))

	// Run the installation command
	try {
		await runInstallCommand(prettierDeps, true)
	} catch (error) {
		console.error(
			`Error while installing Prettier dependencies: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	// Add "prettify" script to package.json
	addPackageJsonScript('prettify', 'prettier --write .')

	// Create the `.prettierrc.json` file
	writeOrUpdateFile(
		'.prettierrc.json',
		prettierConfig,
		{
			fileUpdated: 'Prettier configuration updated successfully!',
			fileSkipped: 'Prettier configuration already exists.',
			fileCreated: 'Prettier configuration created successfully!',
		},
		true
	)

	// Prompt the user and run the "prettify" script if confirmed
	try {
		await runPackageJsonScript('prettify', true)
	} catch (error) {
		console.error("An error occurred while running the 'prettify' script.")
	}
}
