import createIssueGraphQL from './createIssueGraphQL.ts'
import updateProjectStatus from './updateProjectStatus.ts'
import getProjectNodeId from './getProjectNodeId.ts'
import addProjectItemGraphQL from './addProjectItemGraphQL.ts'
import { DEV_PROJECT_ID, INFRA_PROJECT_ID } from '#constants'

interface CreateIssueWithStatusParams {
    repositoryId: string
    title: string
    body: string
    projectType: 'dev' | 'infra'
    status?: string
}

export default async function createIssueWithStatus(params: CreateIssueWithStatusParams) {
    const projectNumber = params.projectType === 'dev' ? DEV_PROJECT_ID : INFRA_PROJECT_ID
    const projectNodeId = await getProjectNodeId(projectNumber)

    // 1. Create Issue (without projectIds, as createIssue doesn't support ProjectV2 IDs)
    const issue = await createIssueGraphQL({
        repositoryId: params.repositoryId,
        title: params.title,
        body: params.body
    })

    if (!issue) {
        return null
    }

    let projectAdded = false
    let projectItemId = issue.projectItemId

    // 2. Add to Project V2
    if (projectNodeId) {
        try {
            const itemId = await addProjectItemGraphQL(projectNodeId, issue.id)
            if (itemId) {
                projectItemId = itemId
                projectAdded = true
            }
        } catch (error) {
            console.error('Failed to add issue to project:', error)
        }
    }

    // 3. Update Status
    if (projectAdded && projectItemId && params.status && projectNodeId) {
        await updateProjectStatus(projectNodeId, projectItemId, params.status)
    }

    return {
        ...issue,
        projectAdded
    }
}
