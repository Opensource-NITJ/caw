import Eris from 'eris';
import { Command } from '../../types/command';
import role from '../../../secret/roles.json';
import emoji from '../../../secret/emoji.json';

export default (bot: Eris.Client): Command => ({
    name: 'rolemenu_helper_roles',
    description: 'Handle helper roles selection',
    type: 'interactionCreate',
    bot,
    async execute(interaction: Eris.Interaction): Promise<void> {
        if (!(interaction instanceof Eris.ComponentInteraction) || 
            interaction.data.component_type !== Eris.Constants.ComponentTypes.SELECT_MENU || 
            interaction.data.custom_id !== 'rolemenu_helper_roles') return;

        try {
            const selectedValues = interaction.data.values;

            const roleIds = selectedValues.map(value => role[value]);
            if (roleIds.some(id => !id)) {
                await interaction.createMessage({
                    content: `❌ Invalid role(s) selected.`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            await interaction.deferUpdate();

            for (const key in role) {
                const rId = role[key];
                if (!['helper_1st_year', 'helper_2nd_year', 'helper_3rd_year', 'helper_4th_year'].includes(key)) continue;
                if (interaction.member?.roles.includes(rId)) {
                    await interaction.member.removeRole(rId);
                }
            }

            for (const rId of roleIds) {
                await interaction.member?.addRole(rId);
            }

            const mentionedSelectedValues = roleIds.map(id => `<@&${id}>`);

            await interaction.createMessage({
                content: `<a:right:${emoji.right}> You have been assigned the helper roles: ${mentionedSelectedValues.join(', ')}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
            

        } catch (error) {
            console.error('Error handling helper role select menu:', error);
            await interaction.createMessage({
                content: `❌ An error occurred: ${(error as Error).message}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
        }
    }
});