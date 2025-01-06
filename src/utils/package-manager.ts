import fs from 'fs'

export const devFlag = (dev: boolean) => (dev ? '-D' : '')
export const packageManagerInstall = {
	npm: 'npm install',
	yarn: 'yarn add',
	bun: 'bun add',
}
export const packageManagerRun = {
	npm: 'npm run',
	yarn: 'yarn',
	bun: 'bun',
}

export function detectPackageManager(): 'npm' | 'yarn' | 'bun' {
	if (fs.existsSync('bun.lockb')) return 'bun'
	if (fs.existsSync('yarn.lock')) return 'yarn'
	if (fs.existsSync('package-lock.json')) return 'npm'
	return 'npm'
}
