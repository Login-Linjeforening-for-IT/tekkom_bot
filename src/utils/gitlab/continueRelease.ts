import { EmbedBuilder } from 'discord.js'
import type { ButtonInteraction, CacheType, ChatInputCommandInteraction, Message } from 'discord.js'
import { postTag } from '#utils/gitlab/tags.ts'
import editEverySecondTillDone from '#utils/gitlab/editEverySecondTillDone.ts'
import getOpenMergeRequests from '#utils/gitlab/getMergeRequests.ts'
import { INFRA_PROD_CLUSTER } from '#constants'
import formatVersion from '#utils/gitlab/formatVersion.ts'
import postMerge from '#utils/gitlab/postMerge.ts'

type HandleMergeProps = {
    sorted: MergeRequest[]
    willMerge: MergeRequest[]
    repository: string
    tag: string
    finalResponse: Message<boolean>
}

type ContinueReleaseProps = {
    message: ChatInputCommandInteraction<CacheType> | ButtonInteraction
    embed: EmbedBuilder
    id: number
    tag: string
    repository: string
    interval: number
}

export default async function continueRelease({ message, embed, id, tag, repository, interval }: ContinueReleaseProps) {
    await message.reply({ embeds: [embed] })
    const response = await message.fetchReply()
    await postTag(id, tag)
    const result = await editEverySecondTillDone(response, message.user.username, id, tag, repository, interval, true)

    // Waiting for editEverySecondTo complete last iteration
    await new Promise(resolve => setTimeout(resolve, (interval * 1000) + 25))
    const finalResponse = await message.fetchReply()

    if (result) {
        const mergeRequests = await getOpenMergeRequests(INFRA_PROD_CLUSTER)
        const relevant: MergeRequest[] = []
        const willMerge: MergeRequest[] = []

        for (const mr of mergeRequests) {
            // eslint-disable-next-line no-useless-escape
            const match = mr.title.match(/registry\.login\.no.*\/([^\/\s]+)\s/)

            if (match) {
                const normalizedQuery = repository.toLowerCase()

                if (match[1] === normalizedQuery) {
                    // simple match
                    //  beehive === beehive -> true
                    relevant.push(mr)
                } else if (match[0].includes(`${normalizedQuery.replaceAll(' ', '-')}/`)) {
                    // two divided repository edge case
                    // tekkom bot vs tekkom_bot/api -> true
                    relevant.push(mr)
                } else if (match[0].includes(`${normalizedQuery}/`)) {
                    // two divided repository edge case
                    // beehive vs beehive/api -> true
                    relevant.push(mr)
                } else if (match[0].trim().endsWith(normalizedQuery.replaceAll(' ', '/'))) {
                    // "Beehive Frontend" vs "beehive/frontend " -> "beehive/frontend" === "beehive/frontend" -> true
                    relevant.push(mr)
                } else {
                    // tekkom_bot v2 vs tekkombotv2 -> true
                    const match1 = match[1].replaceAll('_', '')
                    const broadMatch = match1.replaceAll(' ', '')
                    const query1 = normalizedQuery.replaceAll('_', '')
                    const broadNormalizedQuery = query1.replaceAll(' ', '')

                    if (broadMatch === broadNormalizedQuery) {
                        relevant.push(mr)
                    }
                }
            }
        }

        const sorted = relevant.sort((a, b) => {
            const versionA = formatVersion(a.title)
            const versionB = formatVersion(b.title)

            for (let i = 0; i < 3; i++) {
                const partA = versionA[i]
                const partB = versionB[i]
                if (partA !== partB) {
                    return partB - partA
                }
            }

            return 0
        })

        handleMerge({ sorted, willMerge, repository, tag, finalResponse })
    }
}


async function handleMerge({ sorted, willMerge, repository, tag, finalResponse }: HandleMergeProps) {
    if (sorted.length) {
        const highestVersion = formatVersion(sorted[0].title)
        for (const mr of sorted) {
            if (formatVersion(mr.title).join('.') === highestVersion.join('.')) {
                willMerge.push(mr)
            }
        }

        const result = await merge(willMerge)

        let success = 0
        for (const req of result) {
            if (req.state === 'merged') {
                success++
            }
        }

        if (result.length === success) {
            const final = new EmbedBuilder()
                .setTitle(`Released ${repository} v${tag} to production.`)
                .setColor('#fd8738')
                .setTimestamp()
            finalResponse.edit({ embeds: [...finalResponse.embeds, final] })
        } else {
            const final = new EmbedBuilder()
                .setTitle(`Failed to release ${repository} v${tag} to production.`)
                .setDescription('An error occured while merging. Please resolve manually.')
                .setColor('#fd8738')
                .setTimestamp()
            finalResponse.edit({ embeds: [...finalResponse.embeds, final] })
            console.log(`Failed while merging merge requests for ${repository} v${tag}. Please merge remaining MRs manually.`)
        }
    } else {
        const final = new EmbedBuilder()
            .setTitle(`Found no merge requests for ${repository} v${tag}. Please merge manually.`)
            .setDescription('An error occured while merging. Please resolve manually.')
            .setColor('#fd8738')
            .setTimestamp()
        finalResponse.edit({ embeds: [...finalResponse.embeds, final] })
        console.log(`Found no merge requests for ${repository} v${tag}. Please merge manually.`)
    }
}

async function merge(requests: MergeRequest[]) {
    const responses = []
    for (const request of requests) {
        responses.push(await postMerge(request.iid))
    }

    return responses
}
