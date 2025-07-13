import Eris from 'eris';
import { Command } from '../../types/command';
import emoji from '../../../secret/emoji.json';
import roles from '../../../secret/roles.json';
import fs from 'fs';
export default (bot: Eris.Client): Command => ({
    name: 'rolemenu',
    description: 'Displays the role menu.',
    type: 'onMessage',
    async execute(msg: Eris.Message): Promise<void> {
        bot.createMessage(msg.channel.id, {
            embeds: [{
                title: "Obtain your roles:",
                description: [
                    `<a:stars:${emoji.stars}> » **Freshers** can choose their provisionally alloted branch by using the button and selecting their branch in select menu.`,
                    ``,
                    `<a:stars:${emoji.stars}> » For students who have **joined college** can verify their branch and year by using the CAS system.`,
                    ``,
                    `<a:stars:${emoji.stars}> » **Branch Roles:**`,
                    `- <@&${roles.cs}> | <@&${roles.ds}> | <@&${roles.it}>`,
                    `- <@&${roles.ece}> | <@&${roles.vlsi}> | <@&${roles.ice}>`,
                    `- <@&${roles.ee}>`,
                    `- <@&${roles.mnc}>`,
                    `- <@&${roles.mech}>`,
                    `- <@&${roles.civil}>`,
                    `- <@&${roles.chem}>`,
                    `- <@&${roles.ipe}>`,
                    `- <@&${roles.tt}>`,
                    `- <@&${roles.bio}>`,
                    ``,
                    `<a:stars:${emoji.stars}> » **Year Roles:**`,
                    `- <@&${roles.fresher}> - For people who have been *provisionally alloted* a branch.`,
                    `- <@&${roles.one}> - For people who are in *1st* year.`,
                    `- <@&${roles.two}> - For people who are in *2nd* year.`,
                    `- <@&${roles.three}> - For people who are in *3rd* year.`,
                    `- <@&${roles.four}> - For people who are in *4th* year.`,
                    `- <@&${roles.alumni}> - For people who have *graduated*.`,
                    ``,
                    `<a:stars:${emoji.stars}> » __**You can also choose helper roles to get pinged whenever there is a doubt about a specific topic.**__`,
                    ``,
                    `<a:stars:${emoji.stars}> » **Note:** If you are a **fresher**, please select your provisional branch role using the button below.`,
                ].join(`\n`),
                color: 0x10141F,
                image: {
                    url: 'attachment://banner.png'
                }
            }],
            components: [{
                type: Eris.Constants.ComponentTypes.ACTION_ROW,
                components: [{
                    type: Eris.Constants.ComponentTypes.BUTTON,
                    style: Eris.Constants.ButtonStyles.SECONDARY,
                    label: 'Get provisional role',
                    custom_id: 'rolemenu_freshers_verify',
                    emoji: {
                        id: emoji.heart,
                        name: 'heart'
                    }
                }, {
                    type: Eris.Constants.ComponentTypes.BUTTON,
                    style: Eris.Constants.ButtonStyles.PRIMARY,
                    label: 'Verify using student email',
                    custom_id: 'rolemenu_cas_verify',
                    emoji: {
                        id: emoji.glitters,
                        name: 'glitters',
                        animated: true
                    }
                }]
            }, {
                type: Eris.Constants.ComponentTypes.ACTION_ROW,
                components: [{
                    type: Eris.Constants.ComponentTypes.SELECT_MENU,
                    custom_id: 'rolemenu_helper_roles',
                    placeholder: 'Select helper roles',
                    min_values: 0,
                    max_values: 4,
                    options: [
                        {
                            label: '1st Year',
                            value: 'helper_1st_year',
                            description: 'Get pinged for doubts related to 1st year subjects.',
                            emoji: {
                                name: '🔴'
                            }
                        },
                        {
                            label: '2nd Year',
                            value: 'helper_2nd_year',
                            description: 'Get pinged for doubts related to 2nd year subjects.',
                            emoji: {
                                name: '🟠'
                            }
                        },
                        {
                            label: '3rd Year',
                            value: 'helper_3rd_year',
                            description: 'Get pinged for doubts related to 3rd year subjects.',
                            emoji: {
                                name: '🟡'
                            }
                        },
                        {
                            label: '4th Year',
                            value: 'helper_4th_year',
                            description: 'Get pinged for doubts related to 4th year subjects.',
                            emoji: {
                                name: '🟢'
                            }
                        },
                    ]
                }]
            }]
        }, [{
            file: fs.readFileSync('assets/rolesBanner.png'),
            name: 'banner.png'
        }]);

    }
});