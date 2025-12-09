import { AutocompleteInteraction, TextChannel } from 'discord.js'

export default async function handleRetroactiveAutoComplete(interaction: AutocompleteInteraction<'cached'>) {
    const focusedOption = interaction.options.getFocused(true)

    if (focusedOption.name === 'emoji') {
        const channelId = interaction.options.get('channel')?.value as string
        const messageId = interaction.options.getString('message_id')

        if (!channelId || !messageId) {
            return await interaction.respond([{ name: 'Please select a channel and enter a message ID first', value: 'error' }])
        }

        try {
            const channel = await interaction.guild.channels.fetch(channelId) as TextChannel
            if (!channel || !channel.isTextBased()) {
                return await interaction.respond([{ name: 'Invalid channel', value: 'error' }])
            }

            const message = await channel.messages.fetch(messageId).catch(() => null)
            if (!message) {
                return await interaction.respond([{ name: 'Message not found', value: 'error' }])
            }

            const reactions = message.reactions.cache
            const options = reactions.map(r => {
                const name = r.emoji.name || 'Unknown'
                return { name: `${name} (${r.count})`, value: r.emoji.toString() }
            })

            const filtered = options.filter(o => o.name.toLowerCase().includes(focusedOption.value.toLowerCase()))

            await interaction.respond(filtered.slice(0, 25))
        } catch (error) {
            console.error('Autocomplete error:', error)
            await interaction.respond([])
        }
    }
}
