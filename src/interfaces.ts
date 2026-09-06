import { Role } from 'discord.js'
import { Client, Collection } from 'discord.js'

export type Roles = {
    cache: Role[]
}

interface Command {
    data: { name: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => Promise<void>
}

export class DiscordClient extends Client<true> {
    public commands: Collection<string, Command> = new Collection()
}
