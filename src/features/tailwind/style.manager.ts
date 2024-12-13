import type { FileContent } from '../../types/registry.types.ts'
import { askQuestion, askYesNoQuestion } from '../../utils/prompt.ts'

export class TailwindStyleManager {
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

	public promptStylesPath() {
		return askQuestion(
			'Please specify the path to your styles.css file:',
			'./src/styles.css'
		)
	}

	public async promptExtraStyles() {
		for (const style of this.styles) {
			if (style.promptMessage === '') continue
			style.isEnabled = await askYesNoQuestion(
				style.promptMessage,
				style.isEnabled
			)
		}
	}

	public getContent() {
		const styleContent = this.styles
			.filter(style => style.isEnabled)
			.map(style => style.content)
		return styleContent.join('')
	}
}
