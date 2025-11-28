import type { FastifyReply, FastifyRequest } from 'fastify'
import tokenWrapper from '#utils/tokenWrapper.ts'
import checkAndAlert from '#utils/checkAndAlert.ts'

export default async function getToken(req: FastifyRequest, res: FastifyReply) {
    const response = await tokenWrapper(req, res, ['tekkom-bot', 'queenbee-btg'])
    if (!response.valid) {
        return res.status(400).send(response)
    }

    const name = req.headers['name'] as string
    const middleware = (req.headers['middleware'] as string) === 'true'
    await checkAndAlert(name, 'queenbee', middleware)

    return res.status(200).send(response)
}
