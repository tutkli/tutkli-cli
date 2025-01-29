import { detectPackageManager, packageManagerRun } from './package-manager.ts'
import { runCommand } from './run-command.ts'

/**
 * Adds or updates a script in the project's package.json.
 * If the script already exists, it will be updated.
 * If the package.json or scripts property doesn't exist, it creates them.
 *
 * @param scriptName - The name of the script (e.g., "prettify").
 * @param scriptCommand - The command to add or update (e.g., "prettier --write .").
 */
export async function addPackageJsonScript(
	scriptName: string,
	scriptCommand: string
): Promise<void> {
	try {
		const packageFile = Bun.file('./package.json')

		if (!(await packageFile.exists())) {
			throw new Error('PACKAGE_JSON_NOT_FOUND')
		}

		const packageJson = await packageFile.json()

		packageJson.scripts = packageJson.scripts ?? {}
		packageJson.scripts[scriptName] = scriptCommand

		await packageFile.write(JSON.stringify(packageJson, null, '\t'))
	} catch (error) {
		if (error instanceof Error && error.message === 'PACKAGE_JSON_NOT_FOUND') {
			console.error('package.json not found in the current project directory.')
		} else {
			console.error(
				`Error reading or updating package.json: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}
}

/**
 * Runs a package.json script using the appropriate package manager with optional confirmation.
 *
 * @param scriptName - The name of the script to run (e.g., "prettify").
 */
export async function runPackageJsonScript(scriptName: string): Promise<void> {
	const packageManager = detectPackageManager()

	const command = `${packageManagerRun[packageManager]} ${scriptName}`

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
