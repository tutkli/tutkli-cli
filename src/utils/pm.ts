import { detect } from 'package-manager-detector/detect'

export const detectPm = async () => {
	const pm = await detect()
	return pm ?? { name: 'bun', agent: 'bun' }
}
