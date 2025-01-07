import type { CLIManager } from '../../types/types.ts'
import { showCommand } from '../../utils/messages.ts'
import { askQuestion, askYesNoQuestion } from '../../utils/prompt.ts'

const VALID_STYLE_TYPES = ['css', 'scss', 'less'] as const
type StyleType = (typeof VALID_STYLE_TYPES)[number]

export class NgManager implements CLIManager {
	private projectName: string | undefined
	private style: StyleType | undefined
	private useBun: boolean | undefined

	get ngNewCommand(): string {
		return `ng new ${this.projectName} --minimal --ssr false --style ${this.style} ${
			this.useBun ? '--package-manager bun' : ''
		} --experimental-zoneless`
	}

	public async prompt(): Promise<void> {
		this.projectName = await this.promptProjectName()
		this.style = await this.promptStyleType()
		this.useBun = await this.promptUseBun()
	}

	/**
	 * Prompt the user to confirm whether they want to proceed using the given ng command.
	 * @throws Error if required fields are missing.
	 * @returns True if the user wants to proceed, otherwise false.
	 */
	public async promptProceed(): Promise<boolean> {
		if (!this.projectName || !this.style || this.useBun === undefined) {
			throw new Error(
				'Required fields are missing. Please complete all prompts.'
			)
		}

		await showCommand(this.ngNewCommand)

		return askYesNoQuestion('Do you want to proceed?', true)
	}

	/**
	 * Prompt the user for the project name.
	 * @returns The provided project name.
	 */
	private async promptProjectName(): Promise<string> {
		return await askQuestion('What is the project name?')
	}

	/**
	 * Prompt the user for the project style type.
	 * Defaults to 'css' if no input is provided.
	 * @returns The provided style type.
	 */
	private async promptStyleType(): Promise<StyleType> {
		while (true) {
			const response = await askQuestion(
				'Which stylesheet format would you like to use?',
				'css'
			)

			if (VALID_STYLE_TYPES.includes(response as StyleType)) {
				return response as StyleType
			}

			console.log(
				`"${response}" is not a valid style type. Please choose one of: ${VALID_STYLE_TYPES.join(', ')}.`
			)
		}
	}

	/**
	 * Ask if the user wants to use Bun as a package manager.
	 * Defaults to true if no input is given.
	 * @returns True if Bun is selected, otherwise false.
	 */
	private async promptUseBun(): Promise<boolean> {
		return await askYesNoQuestion(
			'Do you want to use bun as package manager?',
			true
		)
	}
}
