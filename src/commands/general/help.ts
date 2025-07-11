import Eris from 'eris';
import { Command } from '../../types/command';
import { heart, reply, replycontinued } from '../../secret/emoji.json';
import { prefix, developerID } from '../../secret/config.json';
import { version } from '../../../package.json';

export default (bot: Eris.Client): Command => ({
    name: 'help',
    description: 'Shows the help menu',
    type: 'interactionCreate',
    interactionType: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
    bot,
    async execute(interaction: Eris.Interaction): Promise<void> {
        if (interaction.type !== Eris.Constants.InteractionTypes.APPLICATION_COMMAND) return;

        const commandInteraction = interaction as Eris.CommandInteraction;
        await commandInteraction.defer();

        try {
            commandInteraction.createFollowup({
                embeds: [{
                    color: 0xFFFFFF,
                    author: {
                        name: bot.user.username + '#' + bot.user.discriminator || 'User not found',
                        icon_url: bot.user.avatarURL || ''
                    },
                    description: [
                        `<a:heart:${heart}> **General Information:**`,
                        `<:replycontinued:${replycontinued}> Prefix: \`${prefix}\``,
                        `<:replycontinued:${replycontinued}> Websocket Ping: \`${bot.shards.get(0)?.latency}ms\``,
                        `<:replycontinued:${replycontinued}> Uptime: \`${bot.uptime ? Math.floor(bot.uptime / 1000 / 60) : 0} minutes\``,
                        `<:replycontinued:${replycontinued}> Environment: \`${process.env.NODE_ENV || 'development'}\``,
                        `<:replycontinued:${replycontinued}> Eris Version: \`${Eris.VERSION}\``,
                        `<:replycontinued:${replycontinued}> Source Version: \`${version}\``,
                        `<:replycontinued:${replycontinued}> Node.js Version: \`${process.version}\``,
                        `<:reply:${reply}> Developer: \`${bot.users.get(developerID)?.username}\` | <@${developerID}>`,
                        ``,
                        `<a:heart:${heart}> **General Commands:**`,
                        `<:replycontinued:${replycontinued}> \`/help\` - Shows this help menu`,
                        `<:replycontinued:${replycontinued}> \`/ping\` - Shows the bot's latency`,
                    ].join('\n')
                }]
            })
            

        } catch (error) {
            console.error('Error creating help menu:', error);
            try {
                await commandInteraction.createFollowup({
                    content: 'Failed to create help menu. Try again later!',
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
            } catch (followupError) {
                console.error('Error creating help menu error message:', followupError);
            }
        }
    }
});