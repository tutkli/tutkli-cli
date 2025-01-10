import type { CLIManager, FileContent } from '../../types/types.ts'
import { writeOrUpdateFile } from '../../utils/file.ts'
import { askQuestion, askYesNoQuestion } from '../../utils/prompt.ts'
import { spinner } from '../../utils/spinner.ts'

export class TailwindStyleManager implements CLIManager {
	private stylesPath = ''
	private styles: FileContent[] = [
		{
			promptMessage: '',
			isEnabled: true,
			content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`,
		},
		{
			promptMessage: 'Are you using Tailwind alongside Angular Material 3?',
			isEnabled: false,
			content: `\n.mdc-notched-outline__notch {
  border-style: none;
}
.mat-mdc-icon-button {
  line-height: normal;
}\n`,
		},
	]

	public async prompt(): Promise<void> {
		this.stylesPath = await this.promptStylesPath()
		await this.promptExtraStyles()
	}

	public async run(): Promise<void> {
		// Add tailwind directives
		await spinner({
			loadingText: 'Adding TailwindCSS directive...',
			successText: 'TailwindCSS directives added',
			fn: () => writeOrUpdateFile(this.stylesPath, this.getContent()),
		})
	}

	private promptStylesPath() {
		return askQuestion(
			'Please specify the path to your styles.css file:',
			'./src/styles.css'
		)
	}

	private async promptExtraStyles() {
		for (const style of this.styles) {
			if (style.promptMessage === '') continue
			style.isEnabled = await askYesNoQuestion(
				style.promptMessage,
				style.isEnabled
			)
		}
	}

	private getContent() {
		const styleContent = this.styles
			.filter(style => style.isEnabled)
			.map(style => style.content)
		return styleContent.join('')
	}
}
