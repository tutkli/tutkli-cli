import { confirm, group, intro, note, outro, tasks, text } from '@clack/prompts'
import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
import { showDeps } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'

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
	intro(
		chalk.bold.bgHex('#2982AF').hex('#E2E8F0')`  Initializing TailwindCSS...  `
	)

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
				note(`Bye!        `)
				process.exit(0)
			},
		}
	)

	if (!config.install) return

	await tasks([
		{
			title: 'Installing dependencies...',
			task: async () => {
				await runInstallCommand(deps, true)
				return `${chalk.green('✓')} Dependencies installed.`
			},
		},
		{
			title: 'Initializing TailwindCSS...',
			task: () => {
				writeOrUpdateFile('tailwind.config.js', twConfig(), true)
				return `${chalk.green('✓')} TailwindCSS initialized.`
			},
		},
		{
			title: 'Adding TailwindCSS directives...',
			task: () => {
				writeOrUpdateFile(
					config.cssPath,
					twContent({ angular: config.angular })
				)
				return `${chalk.green('✓')} TailwindCSS directives added.`
			},
		},
	])

	outro(chalk.green`TailwindCSS installed successfully!`)
}
