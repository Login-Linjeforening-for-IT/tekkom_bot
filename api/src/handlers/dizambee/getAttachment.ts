import type { FastifyReply, FastifyRequest } from 'fastify'
import config from '#constants'

// Fetches specified attachment
export default async function getAttachment(req: FastifyRequest, res: FastifyReply) {
    const { id, ticket_id, attachment_id } = req.params as { id: string, ticket_id: string, attachment_id: string }
    const url = `${id}/${ticket_id}/${attachment_id}`

    try {
        // Fetches Zammad
        const response = await fetch(`${config.ZAMMAD_API}/ticket_attachment/${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${config.ZAMMAD_TOKEN}`
            }
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        // Converts the stream to a base64 encoded string
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64String = buffer.toString('base64')
        res.send({ attachment: base64String })
    } catch (error) {
        console.log(`Error fetching Zammad attachment ${url}. Error: ${error}`)
        res.status(500).send({ error: `An error occurred while fetching Zammad attachment ${url}. Error: ${error}` })
    }
}
