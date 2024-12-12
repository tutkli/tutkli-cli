import { exec } from 'node:child_process'
import { detectPackageManager } from './package-manager.ts'

export function runCommand(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
				return
			}
			resolve()
		})
	})
}

/**
 * Runs the installation command for the given dependencies.
 *
 * @param dependencies - An array of package names to install (e.g., ["prettier", "eslint"]).
 * @param dev - Whether to install the dependencies as devDependencies (default: true).
 * @returns A promise that resolves when the command completes.
 */
export async function runInstallCommand(
	dependencies: string[],
	dev: boolean = true
): Promise<void> {
	const packageManager = detectPackageManager()
	const devFlag = dev ? '-D' : ''

	let installCommand: string
	switch (packageManager) {
		case 'npm':
			installCommand = `npm install ${devFlag} ${dependencies.join(' ')}`
			break
		case 'yarn':
			installCommand = `yarn add ${devFlag} ${dependencies.join(' ')}`
			break
		case 'bun':
			installCommand = `bun add ${devFlag} ${dependencies.join(' ')}`
			break
		default:
			throw new Error(`Unsupported package manager: ${packageManager}`)
	}

	await runCommand(installCommand)
}

/**
 * Runs a CLI command after determining the correct prefix based on the package manager.
 *
 * @param baseCommand - The base command to execute (e.g., "tailwindcss init").
 * @returns A promise that resolves when the command completes.
 */
export async function runCLICommand(baseCommand: string): Promise<void> {
	const packageManager = detectPackageManager()

	// Build the correct command prefix
	let cliCommand: string
	switch (packageManager) {
		case 'npm':
			cliCommand = `npx ${baseCommand}`
			break
		case 'yarn':
			cliCommand = `yarn ${baseCommand}`
			break
		case 'bun':
			cliCommand = `bunx ${baseCommand}`
			break
		default:
			throw new Error(`Unsupported package manager: ${packageManager}`)
	}

	await runCommand(cliCommand)
}
