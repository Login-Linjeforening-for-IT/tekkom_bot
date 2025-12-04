import { roles } from '#constants'
import tokenWrapper from '#utils/tokenWrapper.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function postRoles(req: FastifyRequest, res: FastifyReply) {
    const newRoles = req.body as Role[] ?? []
    const { valid } = await tokenWrapper(req, res, ['tekkom_bot'])

    if (!valid) {
        return res.status(400).send({ error: 'Unauthorized' })
    }

    if (!newRoles.length) {
        return res.status(400).send({ message: 'Roles cannot be empty.' })
    }

    roles.length = 0
    roles.push(...newRoles)
    return res.send({ message: `Successfully set ${newRoles.length} roles.` })
}
