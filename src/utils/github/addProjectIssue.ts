import { GITHUB_API } from '#constants'
import config from '#config'

export default async function addProjectItem(projectId: string, contentId: string): Promise<string | null> {
    const mutation = `
        mutation($projectId: ID!, $contentId: ID!) {
            addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
                item {
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
                query: mutation,
                variables: {
                    projectId,
                    contentId
                }
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        if (data.errors) {
            throw new Error(JSON.stringify(data.errors))
        }

        return data.data.addProjectV2ItemById.item.id
    } catch (error) {
        console.error('Failed to add item to project via GraphQL:', error)
        throw error
    }
}
