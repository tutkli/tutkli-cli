import fs from 'fs'
import path from 'path'
import { detectPackageManager } from './package-manager.ts'
import { runCommand } from './run-command.ts'

/**
 * Adds or updates a script in the project's package.json.
 * If the script already exists, it will be updated.
 * If the package.json or scripts property doesn't exist, it creates them.
 *
 * @param scriptName - The name of the script (e.g., "prettify").
 * @param scriptCommand - The command to add or update (e.g., "prettier --write .").
 */
export function addPackageJsonScript(
	scriptName: string,
	scriptCommand: string
): void {
	const packageJsonPath = path.resolve('package.json')

	// Check if package.json exists
	if (!fs.existsSync(packageJsonPath)) {
		throw new Error(
			'Error: package.json not found in the current project directory.'
		)
	}

	try {
		// Read the existing package.json
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

		// Initialize scripts if it doesn't exist
		packageJson.scripts = packageJson.scripts || {}

		// Add or overwrite the specific script
		packageJson.scripts[scriptName] = scriptCommand

		// Write the updated package.json back to the disk
		fs.writeFileSync(
			packageJsonPath,
			JSON.stringify(packageJson, null, 2),
			'utf8'
		)
	} catch (error) {
		console.error(
			`Error reading or updating package.json: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}

/**
 * Runs a package.json script using the appropriate package manager with optional confirmation.
 *
 * @param scriptName - The name of the script to run (e.g., "prettify").
 */
export async function runPackageJsonScript(scriptName: string): Promise<void> {
	const packageManager = detectPackageManager()

	let command: string
	switch (packageManager) {
		case 'npm':
			command = `npm run ${scriptName}`
			break
		case 'yarn':
			command = `yarn ${scriptName}`
			break
		case 'bun':
			command = `bun ${scriptName}`
			break
		default:
			throw new Error(`Unsupported package manager: ${packageManager}`)
	}

	try {
		await runCommand(command)
	} catch (error) {
		console.error(
			`Failed to run '${scriptName}' script: ${
				error instanceof Error ? error.message : String(error)
			}`
		)
		throw error
	}
}
