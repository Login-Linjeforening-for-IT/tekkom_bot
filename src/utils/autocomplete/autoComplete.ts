import { AutocompleteInteraction } from 'discord.js'
import handleReopenAutoComplete from './handleReopenAutoComplete.ts'
import handleRetroactiveAutoComplete from './handleRetroactiveAutoComplete.ts'

export default async function Autocomplete(interaction: AutocompleteInteraction<'cached'>) {
    switch (interaction.commandName) {
        case 'retroactive': handleRetroactiveAutoComplete(interaction); break
        case 'reopen': handleReopenAutoComplete(interaction); break
    }
}
