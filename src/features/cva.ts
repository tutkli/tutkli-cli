import { writeOrUpdateFile } from '../utils/file.ts'
import { showErrorText, showSuccessText, showText } from '../utils/messages.ts'
import { askQuestion } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'
import { spinner } from '../utils/spinner.ts'

const cvaDeps = ['cva@beta', 'tailwind-merge']

const cvaUtilContent = `import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});`

export const setupCVA = async () => {
	showText(' CVA ', { bgColor: '#454545', color: '#AAAAAA' })

	// Prompt the user where to add the cva util file
	const cvaUtilPath = await askQuestion(
		'Where would you like to add the cva util file?',
		'./src/utils/cva.ts'
	)

	try {
		// Install dependencies
		await spinner({
			loadingText: 'Installing dependencies...',
			successText: 'Dependencies installed',
			fn: () => runInstallCommand(cvaDeps, false),
		})

		// Create util file
		await spinner({
			loadingText: 'Creating CVA util file...',
			successText: 'CVA util file created',
			fn: () => writeOrUpdateFile(cvaUtilPath, cvaUtilContent),
		})
	} catch (error) {
		showErrorText(
			`Error while setting up CVA: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	showSuccessText('CVA installed successfully!')
}
