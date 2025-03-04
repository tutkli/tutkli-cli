import { spawn } from 'node:child_process'
import {} from './package-manager.ts'

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
