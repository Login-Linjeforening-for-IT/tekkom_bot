import type { FastifyReply, FastifyRequest } from 'fastify'
import config from '#constants'

const { USERINFO_URL } = config

const tokens = {
    'tekkom_bot': config.TEKKOM_BOT_API_TOKEN,
    'tekkom_bot_btg': config.TEKKOM_BOT_BTG_TOKEN,
    'queenbee_btg': config.QUEENBEE_BTG_TOKEN,
}

export default async function tokenWrapper(
    req: FastifyRequest,
    res: FastifyReply,
    custom: string[] = []
): Promise<{ valid: boolean, error?: string }> {
    const authHeader = req.headers['authorization']
    const btg = req.headers['btg']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            valid: false,
            error: 'Missing or invalid Authorization header'
        }
    }

    const token = authHeader.split(' ')[1]
    if (custom.includes('queenbee_btg') && btg === 'queenbee_btg' && token === tokens['queenbee_btg']) {
        return { valid: true }
    }

    if (custom.includes('tekkom_bot') && btg === 'tekkom_bot' && token === tokens['tekkom_bot']) {
        return { valid: true }
    }

    if (custom.includes('tekkom_bot_btg') && btg === 'tekkom_bot_btg' && token === tokens['tekkom_bot_btg']) {
        return { valid: true }
    }

    try {
        const userInfoRes = await fetch(USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!userInfoRes.ok) {
            return {
                valid: false,
                error: 'Unauthorized'
            }
        }

        // const userInfo = await userInfoRes.json()
        // console.log(userInfo)

        return {
            valid: true
        }
    } catch (err) {
        res.log.error(err)
        return res.status(500).send({
            valid: false,
            error: 'Internal server error'
        })
    }
}
