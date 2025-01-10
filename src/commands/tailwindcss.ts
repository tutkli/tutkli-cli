import { cancel, confirm, group, intro, outro, text } from '@clack/prompts'
import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
import { showDeps } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'
import { loadingSpinner } from '../utils/spinner.ts'

const deps = ['tailwindcss']
const twConfig = () => {
	const config = {
		content: ['./src/**/*.{html,ts}'],
		darkMode: 'class',
		theme: {
			extend: {},
		},
		plugins: [],
	}
	return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)}`
}

const extraStyles = {
	angular: `
.mdc-notched-outline__notch {
  border-style: none;
}
.mat-mdc-icon-button {
  line-height: normal;
}
`,
}

const twContent = (styles: { [key in keyof typeof extraStyles]: boolean }) => {
	let base = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
	for (const style of Object.keys(styles)) {
		const castedStyle = style as keyof typeof extraStyles
		if (styles[castedStyle]) {
			base += extraStyles[castedStyle]
		}
	}
	return base
}

export const setupTailwind = async (): Promise<void> => {
	intro(chalk.bold.bgHex('#2982AF').hex('#E2E8F0')`Initializing TailwindCSS...`)

	const config = await group(
		{
			cssPath: () =>
				text({
					message: `Please specify the path to your ${chalk.italic('styles.css')} file:`,
					placeholder: './src/styles.css',
					defaultValue: './src/styles.css',
				}),
			angular: () =>
				confirm({
					message: 'Are you using Tailwind alongside Angular Material 3?',
					initialValue: false,
				}),
			install: async () => {
				await showDeps(deps)
				return confirm({
					message: 'Proceed with the installation?',
					initialValue: true,
				})
			},
		},
		{
			onCancel: () => {
				cancel('CLI operation cancelled')
				process.exit(0)
			},
		}
	)

	if (!config.install) return

	await loadingSpinner({
		startText: 'Installing dependencies....',
		stopText: 'Dependencies installed',
		fn: () => runInstallCommand(deps, true),
	})

	await loadingSpinner({
		startText: 'Initializing TailwindCSS...',
		stopText: 'TailwindCSS initialized',
		fn: () => writeOrUpdateFile('tailwind.config.js', twConfig(), true),
	})

	await loadingSpinner({
		startText: 'Adding TailwindCSS directive...',
		stopText: 'TailwindCSS directives added',
		fn: () =>
			writeOrUpdateFile(config.cssPath, twContent({ angular: config.angular })),
	})

	outro(chalk.bgHex('#13A10E')`TailwindCSS installed successfully!`)
}
