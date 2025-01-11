/**
 * Fetch the latest version of a given dependency from the npm registry.
 * @param {string} depName - The name of the dependency.
 * @returns {Promise<string|'unknown'>} - A promise that resolves to the latest version.
 */
export async function getLatestVersion(
	depName: string
): Promise<string | 'unknown'> {
	try {
		const response = await fetch(`https://registry.npmjs.org/${depName}`)
		const data = await response.json()
		return data['dist-tags']?.latest ?? 'unknown'
	} catch (error) {
		console.error(`Failed to fetch latest version for ${depName}:`, error)
		return 'unknown'
	}
}

/**
 * Resolve the latest versions of a set of dependencies.
 * @param {string[]} dependencies - The array of dependency names.
 */
export async function getDepsWithVersions(dependencies: string[]) {
	return await Promise.all(
		dependencies.map(async dep => {
			const version = await getLatestVersion(dep)
			return `${dep}${version === 'unknown' ? '' : `@${version}`}`
		})
	)
}
