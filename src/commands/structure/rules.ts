import Eris from 'eris';
import { Command } from '../../types/command';
import emoji from '../../../secret/emoji.json';
import fs from 'fs';
export default (bot: Eris.Client): Command => ({
    name: 'rules',
    description: 'Displays the server rules',
    type: 'onMessage',
    async execute(msg: Eris.Message): Promise<void> {

        await bot.createMessage(msg.channel.id, {
            embeds: [{
                description: [
                `**1.** Follow all of Discord's ToS and community guidelines. They can be found at https://discord.com/terms and https://discord.com/guidelines.`,
                ``,
                `**2.** Be respectful to all members. Harassment, hate speech, and discrimination will not be tolerated.`,
                ``,
                `**3.** No spamming or flooding the chat with messages.`,
                ``,
                `**4.** Use appropriate channels for specific topics. Off-topic discussions should be kept to designated channels.`,
                ``,
                `**5.** No NSFW content in any channel unless explicitly allowed.`,
                ``,
                `**6.** Do not share personal information without consent.`,
                ``,
                `**7.** Listen to the moderators and admins. They are here to help maintain a friendly environment.`,
                ``,
                `**8.** Use the report feature to notify moderators of any issues or rule violations.`,
                ``,
                `**9.** No advertising or self-promotion without permission from the server staff.`,
                ``,
                `> If you encounter any behavior that violates these rules, please report it to a moderator immediately. Moderators & Admins will investigate the situation and take appropriate action, which may include warnings, temporary bans, or permanent bans depending on the severity of the offense`,
                ].join('\n'),
                color: 0x10141F,
                image: {
                    url: 'attachment://banner.png'
                }
            }],
            components: [{
                type: Eris.Constants.ComponentTypes.ACTION_ROW,
                components: [{
                    type: Eris.Constants.ComponentTypes.BUTTON,
                    style: Eris.Constants.ButtonStyles.LINK,
                    label: 'Reddit',
                    url: 'https://www.reddit.com/r/NITJalandhar'
                }, {
                    type: Eris.Constants.ComponentTypes.BUTTON,
                    style: Eris.Constants.ButtonStyles.SECONDARY,
                    custom_id: 'heart',
                    label: ' ',
                    emoji: {
                        name: 'heart',
                        id: emoji.heart,
                        animated: true
                    },
                    disabled: true
                }, {
                    type: Eris.Constants.ComponentTypes.BUTTON,
                    style: Eris.Constants.ButtonStyles.LINK,
                    label: 'X Community',
                    url: 'https://twitter.com/i/communities/1924495938443514185'
                }]
            }]
        }, {
            file: fs.readFileSync('assets/rulesBanner.png'),
            name: 'banner.png'
        })
    }
});