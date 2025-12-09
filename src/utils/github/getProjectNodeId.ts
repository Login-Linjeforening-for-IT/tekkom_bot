import { GITHUB_API, GITHUB_ORGANIZATION } from '#constants'
import config from '#config'

const projectNodeIdCache = new Map<number, string>()

export default async function getProjectNodeId(projectNumber: number): Promise<string | null> {
    if (projectNodeIdCache.has(projectNumber)) {
        return projectNodeIdCache.get(projectNumber)!
    }

    const query = `
        query($org: String!, $number: Int!) {
            organization(login: $org) {
                projectV2(number: $number) {
                    id
                }
            }
        }
    `

    try {
        const response = await fetch(`${GITHUB_API}graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    org: GITHUB_ORGANIZATION,
                    number: projectNumber
                }
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        const projectId = data.data?.organization?.projectV2?.id

        if (projectId) {
            projectNodeIdCache.set(projectNumber, projectId)
            return projectId
        }
    } catch (error) {
        console.error('Failed to fetch project node ID:', error)
    }

    return null
}
