import { askQuestion } from '../../utils/prompt.ts'

export class CVAConfigManager {
	public promptUtilPath() {
		return askQuestion(
			'Where would you like to add the cva util file?',
			'./src/utils/cva.ts'
		)
	}

	public getDeps() {
		return ['cva@beta', 'tailwind-merge']
	}

	public getUtilContent() {
		return `import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});`
	}
}
