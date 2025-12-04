import type { FastifyReply, FastifyRequest } from 'fastify'
import config from '#constants'

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export default async function postUser(req: FastifyRequest, res: FastifyReply) {
    const userData = req.body

    try {
        const response = await fetch(`${config.ZAMMAD_API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${config.ZAMMAD_TOKEN}`
            },
            body: JSON.stringify(userData)
        })

        if (!response.ok) {
            const data = await response.json()
            return res.status(response.status).send(data.error)
        }

        const data = await response.json()
        res.status(201).send(data.id)
    } catch (error) {
        console.log(`Error creating customer: ${error}`)
        res.status(500).send({ error: 'An error occurred while creating the customer.' })
    }
}
