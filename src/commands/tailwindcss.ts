import { confirm, group, intro, outro, tasks, text } from '@clack/prompts'
import { bgCyan, gray, green, italic } from 'picocolors'
import { writeOrUpdateFile } from '../utils/file.ts'
import { check, goodbye, showDeps } from '../utils/prompt.ts'
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
	let base = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'
	for (const style of Object.keys(styles)) {
		const castedStyle = style as keyof typeof extraStyles
		if (styles[castedStyle]) {
			base += extraStyles[castedStyle]
		}
	}
	return base
}

export const setupTailwind = async (): Promise<void> => {
	intro(bgCyan('  Initializing TailwindCSS...  '))

	const prompts = await group(
		{
			cssPath: () =>
				text({
					message: `Please specify the path to your ${italic('styles.css')} file:`,
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
				goodbye()
				process.exit(0)
			},
		}
	)

	if (!prompts.install) {
		outro(gray('TailwindCSS initialization cancelled.'))
		return
	}

	await tasks([
		{
			title: 'Installing dependencies...',
			task: async () => {
				await runInstallCommand(deps, true)
				return check('Dependencies installed.')
			},
		},
		{
			title: 'Initializing TailwindCSS...',
			task: async () => {
				await writeOrUpdateFile('tailwind.config.js', twConfig(), true)
				return check('TailwindCSS initialized.')
			},
		},
		{
			title: 'Adding TailwindCSS directives...',
			task: async () => {
				await writeOrUpdateFile(
					prompts.cssPath,
					twContent({ angular: prompts.angular })
				)
				return check('TailwindCSS directives added.')
			},
		},
	])

	outro(green('TailwindCSS installed successfully!'))
}
