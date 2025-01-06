import { showCommand } from '../../utils/messages.ts'
import { askQuestion, askYesNoQuestion } from '../../utils/prompt.ts'

export class NgManager {
	projectName: string | undefined
	style: string | undefined
	bun: boolean | undefined

	public async promptProjectName() {
		this.projectName = await askQuestion('What is the project name?')
		return this.projectName
	}

	public async promptStyleType() {
		this.style = await askQuestion('What is the project style type?', 'css')
		return this.style
	}

	public async promptBun() {
		this.bun = await askYesNoQuestion(
			'Do you want to use bun ask package Manager?',
			true
		)
		return this.bun
	}

	public async promptProceed() {
		if (this.projectName && this.style && this.bun) {
			await showCommand(this.getNgCommand())
			return askYesNoQuestion('Do you want to proceed?', true)
		}

		console.log('An error occurred while trying to proceed')
	}

	public getNgCommand() {
		return `ng new ${this.projectName} --minimal --ssr false --style ${this.style} ${this.bun ? '--package-manager bun' : ''} --experimental-zoneless`
	}
}
