import config from '#constants'
import { FastifyReply, FastifyRequest } from 'fastify'
import pkg from 'fast-levenshtein'
const { get: levenshtein } = pkg

export async function getUserBySearch(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.params as { name: string }

    try {
        let page = 1
        const perPage = 20
        let closestUser = null
        let closestDistance = Infinity

        while (true) {
            const response = await fetch(`${config.ZAMMAD_API}/users?page=${page}&per_page=${perPage}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token token=${config.ZAMMAD_TOKEN}`
                }
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const data = await response.json()
            const users = data.users || []

            if (users.length === 0) {
                break
            }

            // Process each user to find the closest match
            for (const user of users) {
                const distance = levenshtein(user.name, name)
                if (distance <= 3 && distance < closestDistance) {
                    closestDistance = distance
                    closestUser = user
                }
            }

            page++
        }

        // Return the closest match found
        if (closestUser) {
            res.send(closestUser)
        } else {
            res.status(404).send({ error: 'No user found matching the criteria.' })
        }
    } catch (error) {
        console.log(`Error fetching users: ${error}`)
        res.status(500).send({ error: 'An error occurred while fetching users.' })
    }
}
