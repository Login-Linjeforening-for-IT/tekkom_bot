import run from '#db'
import tokenWrapper from '#utils/tokenWrapper.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function postHideActivity(req: FastifyRequest, res: FastifyReply) {
    const { user } = req.body as { user: string } ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom_bot'])
    if (!valid) {
        return res.status(400).send({ error: 'Unauthorized' })
    }

    if (!user) {
        return res.status(400).send({ error: 'Missing user' })
    }

    try {
        const result = await run(
            `WITH ins AS (
                INSERT INTO hidden (name)
                VALUES ($1)
                ON CONFLICT (name) DO NOTHING
                RETURNING 'inserted'::text AS action
            ),
            del AS (
                DELETE FROM hidden
                WHERE name = $1
                AND NOT EXISTS (SELECT 1 FROM ins)
                RETURNING 'deleted'::text AS action
            )
            SELECT action FROM ins
            UNION ALL
            SELECT action FROM del;
            `,
            [user]
        )

        return result.rows[0]
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}
