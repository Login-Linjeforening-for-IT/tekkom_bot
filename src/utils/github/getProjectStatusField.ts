import { GITHUB_API } from '#constants'
import config from '#config'

interface ProjectStatusField {
    fieldId: string
    options: Map<string, string>
}

const projectStatusCache = new Map<string, ProjectStatusField>()

export default async function getProjectStatusField(projectId: string): Promise<ProjectStatusField | null> {
    if (projectStatusCache.has(projectId)) {
        return projectStatusCache.get(projectId)!
    }

    const query = `
        query($projectId: ID!) {
            node(id: $projectId) {
                ... on ProjectV2 {
                    field(name: "Status") {
                        ... on ProjectV2SingleSelectField {
                            id
                            options {
                                id
                                name
                            }
                        }
                    }
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
                variables: { projectId }
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        const field = data.data?.node?.field

        if (field) {
            const options = new Map<string, string>()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            field.options.forEach((opt: any) => {
                options.set(opt.name.toLowerCase(), opt.id)
            })

            const result = {
                fieldId: field.id,
                options
            }
            projectStatusCache.set(projectId, result)
            return result
        }
    } catch (error) {
        console.error('Failed to fetch project status field:', error)
    }

    return null
}
