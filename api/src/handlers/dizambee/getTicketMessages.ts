import config from '#constants'
import checkStatus from '#utils/dizambee/checkStatus.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

// Fetches all articles (messages) for a specific Zammad ticket
export default async function getTicketMessages(req: FastifyRequest, res: FastifyReply) {
    const { ticketID, recipient } = req.params as { ticketID: string, recipient: string }

    try {
        // Fetches Zammad
        const response = await fetch(`${config.ZAMMAD_API}/ticket_articles/by_ticket/${ticketID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${config.ZAMMAD_TOKEN}`
            }
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data)
        }

        const data = await response.json()

        // Early return if only checking recipient (Discord does not know the
        // recipient when trying to send a reply, so we need to give it)
        if (recipient && recipient !== 'false') {
            return res.send(data[0]?.to)
        }

        const isClosed = await checkStatus(ticketID)

        if (isClosed) {
            return res.send({ error: 'closed' })
        }

        // Fetches all the messages from the ticket
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = data.reduce((acc: any, ticket: Ticket) => {
            if (!ticket.internal) {
                const attachments = ticket.attachments.map(attachment => {
                    return {
                        url: `${ticket.ticket_id}/${ticket.id}/${attachment.id}`,
                        name: attachment.filename
                    }
                })
                acc.push({ user: ticket.from, content: ticket.body, attachments })
            }

            return acc
        }, [])

        // Sends back the result
        res.send(result)
    } catch (error) {
        console.log(`Error fetching zammad messages for ticket ${ticketID}. Error: ${error}`)
        res.status(500).send({ error: `An error occured while fetching Zammad messages for ticket ${ticketID}. Error: ${error}` })
    }
}
