import Eris from 'eris';
import { Command } from '../../types/command';
import role from '../../../secret/roles.json';
import emoji from '../../../secret/emoji.json';

export default (bot: Eris.Client): Command => ({
    name: 'rolemenu_freshers_select',
    description: 'Handle freshers role selection',
    type: 'interactionCreate',
    bot,
    async execute(interaction: Eris.Interaction): Promise<void> {
        if (!(interaction instanceof Eris.ComponentInteraction) || 
            interaction.data.component_type !== Eris.Constants.ComponentTypes.SELECT_MENU || 
            interaction.data.custom_id !== 'rolemenu_freshers_select') return;

        try {
            const selectedValue = interaction.data.values[0];

            const roleId = role[selectedValue];
            if (!roleId) {
                await interaction.createMessage({
                    content: `❌ Invalid role selected.`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            const freshersRoleId = role.fresher;

            await interaction.deferUpdate();

            for (const key in role) {
                const rId = role[key];
                if (!['cs', 'ds', 'it', 'ece', 'vlsi', 'ice', 'ee', 'mnc', 'chem', 'civil', 'mech', 'bio', 'tt', 'ipe', 'fresher', 'one', 'two', 'three', 'four', 'alumni'].includes(key)) continue;
                if (interaction.member?.roles.includes(rId)) {
                    await interaction.member.removeRole(rId);
                }
            }
            
            await interaction.member?.addRole(roleId);
            await interaction.member?.addRole(freshersRoleId);

            await interaction.editParent({
                content: `<a:right:${emoji.right}> You have been assigned the <@&${roleId}> & <@&${freshersRoleId}> role.`,
                components: []
            });
            

        } catch (error) {
            console.error('Error handling freshers role select menu:', error);
            await interaction.createMessage({
                content: `❌ An error occurred: ${(error as Error).message}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
        }
    }
});