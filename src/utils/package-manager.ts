import fs from 'fs'

export function detectPackageManager(): string {
	if (fs.existsSync('bun.lockb')) return 'bun'
	if (fs.existsSync('yarn.lock')) return 'yarn'
	if (fs.existsSync('package-lock.json')) return 'npm'
	return 'npm'
}

/**
 * Generates the appropriate installation command for the given dependencies.
 *
 * @param dependencies - An array of package names to install (e.g., ["prettier", "eslint"]).
 * @param dev - Whether to install the dependencies as devDependencies (default: true).
 *
 * @returns A string with the command to install the given dependencies (e.g., "npm install --save-dev prettier eslint").
 */
export function getInstallCommand(
	dependencies: string[],
	dev: boolean = true
): string {
	const packageManager = detectPackageManager()
	const devFlag = dev ? '--dev' : ''

	if (packageManager === 'bun') {
		return `bun add ${devFlag} ${dependencies.join(' ')}`
	} else if (packageManager === 'yarn') {
		return `yarn add ${dev ? '--dev' : ''} ${dependencies.join(' ')}`
	} else if (packageManager === 'npm') {
		return `npm install ${dev ? '--save-dev' : ''} ${dependencies.join(' ')}`
	}

	throw new Error(`Unsupported package manager: ${packageManager}`)
}
