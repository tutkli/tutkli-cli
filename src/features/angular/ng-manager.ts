import { showCommand } from '../../utils/messages.ts'
import { askQuestion, askYesNoQuestion } from '../../utils/prompt.ts'

const VALID_STYLE_TYPES = ['css', 'scss', 'less'] as const
type StyleType = (typeof VALID_STYLE_TYPES)[number]

export class NgManager {
	private projectName: string | undefined
	private style: StyleType | undefined
	private bun: boolean | undefined

	/**
	 * Prompt the user for the project name.
	 * @returns The provided project name.
	 */
	public async promptProjectName(): Promise<string> {
		this.projectName = await askQuestion('What is the project name?')
		return this.projectName
	}

	/**
	 * Prompt the user for the project style type.
	 * Defaults to 'css' if no input is provided.
	 * @returns The provided style type.
	 */
	public async promptStyleType(): Promise<StyleType> {
		while (true) {
			const response = await askQuestion(
				'Which stylesheet format would you like to use?',
				'css'
			)

			if (VALID_STYLE_TYPES.includes(response as StyleType)) {
				this.style = response as StyleType
				return this.style
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
	public async promptBun(): Promise<boolean> {
		this.bun = await askYesNoQuestion(
			'Do you want to use bun as package manager?',
			true
		)
		return this.bun
	}

	/**
	 * Prompt the user to confirm whether they want to proceed using the given ng command.
	 * @throws Error if required fields are missing.
	 * @returns True if the user wants to proceed, otherwise false.
	 */
	public async promptProceed(): Promise<boolean> {
		if (!this.projectName || !this.style || this.bun === undefined) {
			throw new Error(
				'Required fields are missing. Please complete all prompts.'
			)
		}

		const command = this.getNgNewCommand()
		await showCommand(command)

		return askYesNoQuestion('Do you want to proceed?', true)
	}

	/**
	 * Generate the Angular CLI command for creating a new project.
	 * @throws Error if required fields are missing.
	 * @returns The `ng new` command string.
	 */
	public getNgNewCommand(): string {
		if (!this.projectName || !this.style) {
			throw new Error(
				'Project name or style is missing. Cannot generate NG command.'
			)
		}

		return `ng new ${this.projectName} --minimal --ssr false --style ${this.style} ${
			this.bun ? '--package-manager bun' : ''
		} --experimental-zoneless`
	}
}
