import Eris from 'eris';
import { Command } from '../../types/command';
import { databaseManager } from '../../lib/database';

export default (bot: Eris.Client): Command => ({
    name: 'rolemenu_cas_verify',
    description: 'Verify using student email',
    type: 'interactionCreate',
    bot,
    async execute(interaction: Eris.Interaction): Promise<void> {
        if (!(interaction instanceof Eris.ComponentInteraction) || 
            interaction.data.component_type !== Eris.Constants.ComponentTypes.BUTTON) return;


        try {
            

            await interaction.createModal({
                title: 'Verify your credentials',
                custom_id: `rolemenu_cas_verify_modal`,
                components: [
                    {
                        type: Eris.Constants.ComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: Eris.Constants.ComponentTypes.TEXT_INPUT,
                                custom_id: 'email',
                                label: 'Enter your student email:',
                                style: Eris.Constants.TextInputStyles.SHORT,
                                min_length: 1,
                                max_length: 200,
                                required: true,
                                placeholder: 'student@nitj.ac.in'
                            }
                        ]
                    }
                ]
            });

        } catch (error) {
            console.error('Error verifying student email:', error);
            await interaction.createMessage({
                content: `❌ An error occurred while verifying the student email: ${error instanceof Error ? error.message : 'Unknown error'}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
        }
    }
});