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
