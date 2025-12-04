import type { FastifyReply, FastifyRequest } from 'fastify'
import config from '#constants'

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export default async function postTicket(req: FastifyRequest, res: FastifyReply) {
    const ticketData = req.body

    try {
        const response = await fetch(`${config.ZAMMAD_API}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${config.ZAMMAD_TOKEN}`
            },
            body: JSON.stringify(ticketData)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        res.status(201).send(data.id)
    } catch (error) {
        console.error(`Error creating ticket: ${error}`)
        res.status(500).send({ error: 'An error occurred while creating the ticket.' })
    }
}
