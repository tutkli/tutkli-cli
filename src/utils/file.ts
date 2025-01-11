import fs from 'node:fs'
import path from 'node:path'

/**
 * Utility to create or overwrite a file in the project directory.
 *
 * @param relativePath - The relative path to the file (e.g., ".prettierrc.json").
 * @param content - The content to write to the file.
 * @param overwrite
 * @returns A boolean indicating whether the file was successfully created or overwritten.
 */
export function writeOrUpdateFile(
	relativePath: string,
	content: string,
	overwrite = false
): 'success' | 'failure' | 'skipped' {
	const absolutePath = path.resolve(relativePath)

	try {
		// Check if the file already exists
		if (fs.existsSync(absolutePath) && !overwrite) {
			const existingContent = fs.readFileSync(absolutePath, 'utf8')

			// Check if the content is already in the file
			const linesToAdd = content
				.split(/\r?\n/)
				.filter(line => line.trim() !== '') // Non-empty lines
			const existingLines = new Set(
				existingContent.split(/\r?\n/).map(line => line.trim())
			)

			const allLinesExist = linesToAdd.every(line =>
				existingLines.has(line.trim())
			)

			if (allLinesExist) {
				return 'skipped'
			}

			// Append content to the file if it doesn't exist
			fs.appendFileSync(absolutePath, content)
			return 'success'
		}

		fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
		fs.writeFileSync(absolutePath, content, 'utf8')
		return 'success'
	} catch (error) {
		console.error(
			`Error reading or updating ${absolutePath}: ${error instanceof Error ? error.message : String(error)}`
		)
		return 'failure'
	}
}
