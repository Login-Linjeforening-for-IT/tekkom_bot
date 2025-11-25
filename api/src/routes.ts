import getAnnouncements from './handlers/announcements/get.ts'
import postAnnouncements from './handlers/announcements/post.ts'
import putAnnouncements from './handlers/announcements/put.ts'
import deleteAnnouncements from './handlers/announcements/delete.ts'
import getChannels from './handlers/channels/get.ts'
import postChannels from './handlers/channels/post.ts'
import getIndex from './handlers/index/getIndex.ts'
import postSentAnnouncements from './handlers/sent/post.ts'
import getRoles from './handlers/roles/get.ts'
import postRoles from './handlers/roles/post.ts'
import getBtg from './handlers/btg/get.ts'
import postBtg from './handlers/btg/post.ts'
import postListen from './handlers/activity/postListen.ts'
import getActivity from './handlers/activity/getListen.ts'
import postHideActivity from './handlers/activity/postHide.ts'
import postGame from './handlers/activity/postGame.ts'
import getTrackPreview from './handlers/spotify/get.ts'
import postIssue from './handlers/issue/post.ts'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import getGameActivity from './handlers/activity/getGame.ts'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get('/', getIndex)

    // channels
    fastify.get('/channels', getChannels)
    fastify.post('/channels', postChannels)

    // roles
    fastify.get('/roles', getRoles)
    fastify.post('/roles', postRoles)

    // announcements
    fastify.get('/announcements', getAnnouncements)
    fastify.put('/announcements', putAnnouncements)
    fastify.post('/announcements', postAnnouncements)
    fastify.delete('/announcements', deleteAnnouncements)
    fastify.post('/sent', postSentAnnouncements)

    // btg
    fastify.get('/btg', getBtg)
    fastify.post('/btg', postBtg)

    // activity
    fastify.get('/activity', getActivity)
    fastify.get('/activity/games', getGameActivity)
    fastify.post('/activity/listen', postListen)
    fastify.post('/activity/game', postGame)
    fastify.post('/activity/hide', postHideActivity)

    // spotify
    fastify.get('/track/:id', getTrackPreview)

    // issue
    fastify.post('/issue', postIssue)
}
