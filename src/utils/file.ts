/**
 * Utility to create or overwrite a file in the project directory.
 *
 * @param relativePath - The relative path to the file (e.g., ".prettierrc.json").
 * @param newContent - The content to write to the file.
 * @param overwrite
 * @returns A boolean indicating whether the file was successfully created or overwritten.
 */
export async function writeOrUpdateFile(
	relativePath: string,
	newContent: string,
	overwrite = false
): Promise<'success' | 'failure'> {
	try {
		const file = Bun.file(relativePath)

		if (!(await file.exists()) || overwrite) {
			await Bun.write(relativePath, newContent)
			return 'success'
		}

		const stream = file.stream()
		const existingContent = await Bun.readableStreamToText(stream)

		await file.write(`${existingContent}\n\n${newContent}`)
		return 'success'
	} catch (error) {
		console.error(
			`Error reading or updating ${relativePath}: ${error instanceof Error ? error.message : String(error)}`
		)
		return 'failure'
	}
}
