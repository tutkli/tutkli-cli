import fs from 'fs'
import path from 'path'

/**
 * Utility to create or overwrite a file in the project directory.
 *
 * @param relativePath - The relative path to the file (e.g., ".prettierrc.json").
 * @param content - The content to write to the file.
 * @param messages
 *
 * @returns A boolean indicating whether the file was successfully created or overwritten.
 */
export function writeOrUpdateFile(
	relativePath: string,
	content: string,
	messages: {
		fileUpdated: string
		fileSkipped: string
		fileCreated: string
	}
): boolean {
	const absolutePath = path.resolve(relativePath)

	// Check if the file already exists
	if (fs.existsSync(absolutePath)) {
		const existingContent = fs.readFileSync(absolutePath, 'utf8')

		// Split `content` into lines and check if they're already in the file
		const linesToAdd = content.split(/\r?\n/).filter(line => line.trim() !== '') // Non-empty lines
		const existingLines = new Set(
			existingContent.split(/\r?\n/).map(line => line.trim())
		)

		const allLinesExist = linesToAdd.every(line =>
			existingLines.has(line.trim())
		)

		if (allLinesExist) {
			console.log(messages.fileSkipped)
			return false // Content already exists, skip updating
		}

		// Append content to the file if it doesn't exist
		fs.appendFileSync(absolutePath, content)
		console.log(messages.fileUpdated)
		return true
	}

	try {
		fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
		fs.writeFileSync(absolutePath, content, 'utf8')
		console.log(messages.fileCreated)
		return true
	} catch (error) {
		console.error(
			`Error reading or updating ${absolutePath}: ${error instanceof Error ? error.message : String(error)}`
		)
		return false
	}
}
