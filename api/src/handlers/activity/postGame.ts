import run from '#db'
import { loadSQL } from '#utils/loadSQL.ts'
import tokenWrapper from '#utils/tokenWrapper.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function postGame(req: FastifyRequest, res: FastifyReply) {
    const {
        name,
        user,
        userId,
        avatar,
        details,
        state,
        application,
        start,
        party,
        image,
        imageText
    } = req.body as Game

    const { valid } = await tokenWrapper(req, res, ['tekkom_bot'])
    if (!valid) {
        return res.status(400).send({ error: 'Unauthorized' })
    }

    if (!name || !user || !userId || !avatar || !start) {
        return res.status(400).send({ error: 'Please provide a valid game activity.' })
    }

    try {
        console.log(`Adding game '${name}' for user '${user}'.`)
        const userQuery = await loadSQL('postUser.sql')
        await run(userQuery, [userId, avatar, user])
        const gameQuery = await loadSQL('postGame.sql')
        const gameResult = await run(gameQuery, [name, image ?? null, imageText ?? null])
        const gameId = gameResult.rows[0].id
        const gameActivityQuery = await loadSQL('postGameActivity.sql')
        await run(gameActivityQuery, [
            gameId,
            userId,
            details ?? null,
            state ?? null,
            application ?? null,
            start,
            party ?? null
        ])

        return res.send({ message: `Successfully added game ${name} for ${user}.` })
    } catch (error) {
        console.log('Database error:', error)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}
