import fs from 'fs'

export function detectPackageManager(): string {
	if (fs.existsSync('bun.lockb')) return 'bun'
	if (fs.existsSync('yarn.lock')) return 'yarn'
	if (fs.existsSync('package-lock.json')) return 'npm'
	return 'npm'
}
