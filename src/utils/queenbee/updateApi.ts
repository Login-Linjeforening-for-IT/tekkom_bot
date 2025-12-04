import config from '#config'

const tekkomBotApiUrl = config.tekkomBotApiUrl
const tekkomBotApiToken = config.tekkomBotApiToken

export default async function updateApi(messages: Announcement[]) {
    try {
        if (!messages.length) {
            return
        }

        const ids = messages.map((message) => message.id)
        const response = await fetch(`${tekkomBotApiUrl}/sent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tekkomBotApiToken}`,
                'btg': 'tekkom_bot',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
