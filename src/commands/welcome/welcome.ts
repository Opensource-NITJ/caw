import Eris from 'eris';
import { Command } from '../../types/command';
// Removed unused import
import channel from '../../../secret/channel.json';
import config from '../../../secret/config.json';

export default (bot: Eris.Client): Command => ({
    name: 'welcome_module',
    description: 'Handles the welcome message',
    type: 'guildMemberAdd',
    async execute(guild: Eris.Guild, member: Eris.Member): Promise<void> {
        
        if (guild.id !== config.guildID) return;

        await bot.createMessage(channel.welcome, {
            content: [
                `Howdy <@${member.id}>! Welcome to **${guild.name}**!`,
                `Please take your roles from <#${channel.roles}> to get access to the server.`,
            ].join('\n'),
        })
    }
});