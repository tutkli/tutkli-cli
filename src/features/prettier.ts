import { writeOrUpdateFile } from '../utils/file.ts'
import { showErrorText, showSuccessText, showText } from '../utils/messages.ts'
import {
	addPackageJsonScript,
	runPackageJsonScript,
} from '../utils/package-json.ts'
import { askYesNoQuestion } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command'
import { spinner } from '../utils/spinner.ts'

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
	showText(' Prettier ', { bgColor: '#A04967' })

	const runPrettify = await askYesNoQuestion(
		'Would you like to run the "prettify" script after installation?',
		true
	)

	try {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(prettierDeps, true),
		})

		// Add prettify script
		await spinner({
			loadingText: 'Adding "prettify" script...',
			successText: 'Prettify script added',
			fn: () => addPackageJsonScript('prettify', 'prettier --write .'),
		})

		// Create .prettierrc.json file
		await spinner({
			loadingText: 'Creating .prettierrc.json file....',
			successText: '.prettierrc.json file created',
			fn: () => writeOrUpdateFile('.prettierrc.json', prettierConfig, true),
		})

		if (runPrettify) {
			// Run prettify script
			await spinner({
				loadingText: 'Running "prettify" script...',
				successText: 'Ran Prettify script',
				fn: () => runPackageJsonScript('prettify'),
			})
		}
	} catch (error) {
		showErrorText(
			`Error while setting up Prettier: ${error instanceof Error ? error.message : String(error)}`
		)
	}

	showSuccessText('Prettier installed successfully!')
}
