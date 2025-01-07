export type DepPlugin = {
	dependency: string
	promptMessage: string
	isEnabled: boolean
}

export type FileContent = {
	promptMessage: string
	isEnabled: boolean
	content: string
}

export interface CLIManager {
	prompt: () => Promise<void>
	promptProceed: () => Promise<boolean>
}
