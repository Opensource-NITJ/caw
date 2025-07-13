import Eris from 'eris';
import { Command } from '../../types/command';
import { databaseManager } from '../../lib/database';
import emoji from '../../../secret/emoji.json';

export default (bot: Eris.Client): Command => ({
    name: 'rolemenu_cas_verify_modal',
    description: 'Handle CAS verification modal submission',
    type: 'interactionCreate',
    bot,
    async execute(interaction: Eris.Interaction): Promise<void> {
        if (!(interaction instanceof Eris.ModalSubmitInteraction)) return;

        try {
            await interaction.defer(Eris.Constants.MessageFlags.EPHEMERAL);

            const emailComponent = interaction.data.components.find(comp => 
                comp.components[0].custom_id === 'email'
            );

            const email = emailComponent?.components[0].value;

            await interaction.createMessage({
                embeds: [{
                    description: `<:red:${emoji.red}> This system is under maintenance!`,
                    color: 0xDC143C
                }],
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });

        } catch (error) {
            console.error('Error processing modal submission:', error);
            await interaction.createMessage({
                content: `❌ An error occurred while submitting your email: ${(error as Error).message}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
        }
    }
});