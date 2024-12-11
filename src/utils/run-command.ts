import { exec } from 'node:child_process'

export function runCommand(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
				return
			}
			console.log(`stdout: ${stdout}`)
			resolve()
		})
	})
}
