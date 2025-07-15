import Eris from 'eris';
import { Command } from '../../types/command';
import { databaseManager } from '../../lib/database';

export default (bot: Eris.Client): Command => ({
    name: 'rolemenu_freshers_verify',
    description: 'Obtain branch role for freshers',
    type: 'interactionCreate',
    bot,
    async execute(interaction: Eris.Interaction): Promise<void> {
        if (!(interaction instanceof Eris.ComponentInteraction) || 
            interaction.data.component_type !== Eris.Constants.ComponentTypes.BUTTON) return;

        const user = await databaseManager.getUser(interaction.member?.id || interaction.user?.id || "unknown");
        if (user) {
            await interaction.createMessage({
                content: `❌ You are already registered with the email **${user.email}**.`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
            return;
        }


        try {
            

            await interaction.createMessage({
                content: `Use this select menu to choose branch roles:`,
                components: [{
                    type: Eris.Constants.ComponentTypes.ACTION_ROW,
                    components: [{
                        type: Eris.Constants.ComponentTypes.SELECT_MENU,
                        custom_id: 'rolemenu_freshers_select',
                        options: [
                            {
                                label: 'Computer Science',
                                value: 'cs',
                            },
                            {
                                label: 'Data Science',
                                value: 'ds',
                            },
                            {
                                label: 'Information Technology',
                                value: 'it',
                            },
                            {
                                label: 'Electronics and Communication',
                                value: 'ece',
                            },
                            {
                                label: 'Electronics and VLSI Design',
                                value: 'vlsi',
                            },
                            {
                                label: 'Instrumentation and Control Engineering',
                                value: 'ice',
                            },
                            {
                                label: 'Electrical Engineering',
                                value: 'ee',
                            },
                            {
                                label: 'Mathematics and Computing',
                                value: 'mnc',
                            },
                            {
                                label: 'Mechanical Engineering',
                                value: 'mech',
                            },
                            {
                                label: 'Civil Engineering',
                                value: 'civil',
                            },
                            {
                                label: 'Chemical Engineering',
                                value: 'chem',
                            },
                            {
                                label: 'Industrial and Production Engineering',
                                value: 'ipe',
                            },
                            {
                                label: 'Textile Technology',
                                value: 'tt',
                            },
                            {
                                label: 'Biotechnology',
                                value: 'bio',
                            }
                        ],
                        placeholder: 'Click here to select your branch',
                        min_values: 1,
                        max_values: 1,
                    }]
                }],
                flags: Eris.Constants.MessageFlags.EPHEMERAL,
            })

        } catch (error) {
            console.error('Error verifying student email:', error);
            await interaction.createMessage({
                content: `❌ An error occurred while verifying the student email: ${error instanceof Error ? error.message : 'Unknown error'}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
        }
    }
});