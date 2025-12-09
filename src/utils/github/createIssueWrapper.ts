import createIssue from './createIssue.ts'
import updateStatus from './updateIssue.ts'
import getProjectNodeId from './getProjectNodeId.ts'
import addProjectItem from './addProjectIssue.ts'
import { DEV_PROJECT_ID, INFRA_PROJECT_ID } from '#constants'

interface CreateIssueWithStatusParams {
    repositoryId: string
    title: string
    body: string
    projectType: 'dev' | 'infra'
    status?: string
}

export default async function create(params: CreateIssueWithStatusParams) {
    const projectNumber = params.projectType === 'dev' ? DEV_PROJECT_ID : INFRA_PROJECT_ID
    const projectNodeId = await getProjectNodeId(projectNumber)

    // 1. Create Issue
    const issue = await createIssue({
        repositoryId: params.repositoryId,
        title: params.title,
        body: params.body
    })

    if (!issue) {
        return null
    }

    let projectAdded = false
    let projectItemId = issue.projectItemId

    // 2. Add to Project
    if (projectNodeId) {
        try {
            const itemId = await addProjectItem(projectNodeId, issue.id)
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
        await updateStatus(projectNodeId, projectItemId, params.status)
    }

    return {
        ...issue,
        projectAdded
    }
}
