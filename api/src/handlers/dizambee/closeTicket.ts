import config from '#constants'
import type { FastifyReply, FastifyRequest } from 'fastify'

// Closes the ticket with the passed id
export default async function closeTicket(req: FastifyRequest, res: FastifyReply) {
    const { ticketID, author } = req.params as { ticketID: string, author: string }

    try {
        if (!ticketID || !author) {
            throw new Error(`Missing ticketID (${ticketID}) or author (${author}).`)
        }

        const response = await fetch(`${config.ZAMMAD_API}/ticket/${ticketID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${config.ZAMMAD_TOKEN}`
            },
            body: JSON.stringify({
                'group_id': 37,
                'customer_id': 3116,
                'article': {
                    'body': `Closed by ${author}.`,
                    'type': 'email',
                    'internal': false
                },
                'state': 'closed',
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return res.status(201).send(data.id)
    } catch (error) {
        console.error(`Error deleting ticket: ${error}`)
        return res.status(500).send({ error: 'An error occurred while deleting the ticket.' })
    }
}
