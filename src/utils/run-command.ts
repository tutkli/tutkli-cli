import { spawn } from 'node:child_process'
import {
	detectPackageManager,
	devFlag,
	packageManagerInstall
} from './package-manager.ts'

export function runCommand(
	command: string,
	showStdio?: boolean
): Promise<void> {
	return new Promise((resolve, reject) => {
		const process = spawn(command, {
			shell: true,
			stdio: showStdio ? 'inherit' : 'ignore'
		})

		process.on('error', error => {
			reject(
				new Error(`Command "${command}" failed with error: ${error.message}`)
			)
		})

		process.on('close', code => {
			if (code !== 0) {
				reject(new Error(`Command "${command}" exited with code ${code}`))
			} else {
				resolve()
			}
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
	dev = true
): Promise<void> {
	const packageManager = detectPackageManager()

	const installCommand = `${packageManagerInstall[packageManager]} ${devFlag(dev)} ${dependencies.join(' ')}`

	await runCommand(installCommand)
}
