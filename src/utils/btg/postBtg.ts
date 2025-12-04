import config from '#config'

const tekkomBotApiUrl = config.tekkomBotApiUrl
const tekkomBotBtgToken = config.tekkomBotBtgToken

export default async function postBtg(name: string, service: string, author: string): Promise<boolean> {
    try {
        const response = await fetch(`${tekkomBotApiUrl}/btg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'btg': 'tekkom_bot_btg',
                'Authorization': `Bearer ${tekkomBotBtgToken}`
            },
            body: JSON.stringify({ name, service, author })
        })

        if (!response.ok || response.status !== 200) {
            throw new Error(await response.text())
        }

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
