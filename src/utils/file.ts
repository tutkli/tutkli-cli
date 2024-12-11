import fs from 'fs'
import path from 'path'

/**
 * Utility to create or overwrite a file in the project directory.
 *
 * @param relativePath - The relative path to the file (e.g., ".prettierrc.json").
 * @param content - The content to write to the file.
 * @param overwrite - Whether to overwrite the file if it already exists (default: true).
 *
 * @returns A boolean indicating whether the file was successfully created or overwritten.
 */
export function createFile(
	relativePath: string,
	content: string,
	overwrite: boolean = true
): boolean {
	const absolutePath = path.resolve(relativePath)

	// Check if the file already exists
	if (fs.existsSync(absolutePath)) {
		if (!overwrite) {
			console.warn(`File "${relativePath}" already exists. Skipping creation.`)
			return false
		}
	}

	try {
		fs.writeFileSync(absolutePath, content, 'utf8')
		console.log(`Successfully created file: ${relativePath}`)
		return true
	} catch (error) {
		console.error(
			`Error reading or updating package.json: ${error instanceof Error ? error.message : String(error)}`
		)
		return false
	}
}
