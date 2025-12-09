import { GITHUB_API } from '#constants'
import config from '#config'
import getProjectStatusField from './getProjectStatusField.ts'

export default async function updateStatus(projectId: string, itemId: string, statusName: string): Promise<void> {
    const statusField = await getProjectStatusField(projectId)

    if (!statusField) {
        console.error('Status field not found in project')
        return
    }

    const optionId = statusField.options.get(statusName.toLowerCase())
    if (!optionId) {
        console.error(`Status option '${statusName}' not found`)
        return
    }

    const mutation = `
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
            updateProjectV2ItemFieldValue(input: {
                projectId: $projectId
                itemId: $itemId
                fieldId: $fieldId
                value: {
                    singleSelectOptionId: $optionId
                }
            }) {
                projectV2Item {
                    id
                }
            }
        }
    `

    try {
        const mutationResponse = await fetch(`${GITHUB_API}graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    projectId,
                    itemId,
                    fieldId: statusField.fieldId,
                    optionId: optionId
                }
            })
        })

        if (!mutationResponse.ok) {
            throw new Error(await mutationResponse.text())
        }

        const mutationData = await mutationResponse.json()
        if (mutationData.errors) {
            throw new Error(JSON.stringify(mutationData.errors))
        }

    } catch (error) {
        console.error('Failed to update project status:', error)
    }
}
