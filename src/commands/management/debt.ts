import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'
import type { Roles } from '#interfaces'
import config from '#config'
import { Role } from 'discord.js'

interface DebtRow {
    user_id: string
    amount: number
}

interface RemoveDebtBody {
    user_id: string
    amount?: number
}

export const data = new SlashCommandBuilder()
    .setName('debt')
    .setDescription('Manage debt for late meetings')
    .addSubcommand(sub =>
        sub
            .setName('add')
            .setDescription('Add debt to a user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to add debt to')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option
                    .setName('amount')
                    .setDescription('Number of packs of snacks')
                    .setRequired(true)
            )
    )
    .addSubcommand(sub =>
        sub
            .setName('show')
            .setDescription('Show all debt')
    )
    .addSubcommand(sub =>
        sub
            .setName('remove')
            .setDescription('Remove debt from a user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to remove debt from')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option
                    .setName('amount')
                    .setDescription('Number of packs to remove (leave empty to remove all)')
                    .setRequired(false)
            )
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()
    const isAllowed = (interaction.member?.roles as unknown as Roles)?.cache.some((role: Role) => role.id === config.roleID)

    if (!isAllowed) {
        return await interaction.reply('Unauthorized.')
    }

    if (interaction.channelId !== config.tekkomVervChannelId!) {
        return await interaction.reply('This command can only be used in the TekKom verv channel.')
    }

    await interaction.deferReply()

    const headers = {
        'Authorization': `Bearer ${config.tekkomBotApiToken}`,
        'btg': 'tekkom-bot',
        'Content-Type': 'application/json'
    }

    if (subcommand === 'add') {
        const user = interaction.options.getUser('user')!
        const amount = interaction.options.getInteger('amount')!

        const response = await fetch(`${config.tekkomBotApiUrl}/debt`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                user_id: user.id,
                amount
            })
        })

        if (!response.ok) {
            return await interaction.editReply('Failed to add debt.')
        }

        await interaction.editReply(`Added ${amount} pack${amount > 1 ? 's' : ''} of debt to ${user.displayName}.`)

    } else if (subcommand === 'show') {
        const response = await fetch(`${config.tekkomBotApiUrl}/debt`, {
            headers
        })

        if (!response.ok) {
            return await interaction.editReply('Failed to fetch debt.')
        }

        const debts: DebtRow[] = await response.json()

        if (debts.length === 0) {
            return await interaction.editReply('No debt recorded.')
        }

        const embed = new EmbedBuilder()
            .setTitle(':gifflarcrumbs: Gifflar Debt :gifflarcrumbs:')
            .setColor('#fd8738')
            .setTimestamp()

        const userPromises = debts.map(async (row) => {
            try {
                const packs = row.amount
                return `<@${row.user_id}>: ${packs} pack${packs > 1 ? 's' : ''} :gifflar: `
            } catch {
                const packs = row.amount
                return `<@${row.user_id}>: ${packs} pack${packs > 1 ? 's' : ''} :gifflar: `
            }
        })

        const descriptions = await Promise.all(userPromises)
        const description = descriptions.join('\n')

        embed.setDescription(description)
        await interaction.editReply({ embeds: [embed] })

    } else if (subcommand === 'remove') {
        const user = interaction.options.getUser('user')!
        const amount = interaction.options.getInteger('amount')

        const body: RemoveDebtBody = { user_id: user.id }
        if (amount !== null) {
            body.amount = amount
        }

        const response = await fetch(`${config.tekkomBotApiUrl}/debt`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const error = await response.json()
            return await interaction.editReply(error.error || 'Failed to remove debt.')
        }

        if (amount !== null) {
            await interaction.editReply(`Removed ${amount} pack${amount > 1 ? 's' : ''} of debt from ${user.displayName}.`)
        } else {
            await interaction.editReply(`Removed all debt from ${user.displayName}.`)
        }
    }
}