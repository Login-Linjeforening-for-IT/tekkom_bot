import run from '#db'
import tokenWrapper from '#utils/tokenWrapper.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function postSentAnnouncements(req: FastifyRequest, res: FastifyReply) {
    const ids = req.body as string[] ?? []
    const { valid } = await tokenWrapper(req, res, ['tekkom_bot'])
    if (!valid) {
        return res.status(400).send({ error: 'Unauthorized' })
    }

    if (!ids || ids.length <= 0) {
        return res.status(400).send({ error: 'An array of ids to declare as sent must be provided.' })
    }

    try {
        console.log(`Updating announcements: ${ids.join(', ')}.`)

        await run(
            `UPDATE announcements
                SET sent = true,
                    last_sent = NOW()
                WHERE id = ANY($1::int[]);`,
            [ids]
        )

        return res.send({ message: `Successfully updated ${ids.length} announcements.` })
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}
