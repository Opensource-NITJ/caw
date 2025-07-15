import Eris from 'eris';
import { Command } from '../../types/command';
import { databaseManager } from '../../lib/database';
import emoji from '../../../secret/emoji.json';
import { Address } from 'address-rfc2821';
import roles from '../../../secret/roles.json';

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
            let parsedEmail: Address;

            try {
                parsedEmail = new Address(email);
            } catch (error) {
                await interaction.createMessage({
                    content: `❌ Invalid email format. Please enter a valid email address.`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            const userId = interaction.member?.id || interaction.user?.id || "unknown"

            let user = await databaseManager.getUser(userId);
            if (user) {
                await interaction.createMessage({
                    content: `❌ You are already registered with the email **${user.email}**.`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }
            
            const emailUserName = parsedEmail.user
            const emailDomain = parsedEmail.host;

            if (emailDomain !== 'nitj.ac.in') {
                await interaction.createMessage({
                    content: `❌ Please use your student email from **NIT Jalandhar** (e.g., **student@nitj.ac.in**)`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            let brokenUsername = emailUserName.split('.');

            let firstName = brokenUsername[0].slice(0, -1);
            let lastName = brokenUsername[0].slice(-1);

            let branch = brokenUsername[1] || 'Unknown';

            let branchEmailMap = {
                "cs": "cs",
                "ds": "ds",
                "it": "it",
                "ec": "ece",
                "ev": "vlsi",
                "ic": "ice",
                "ee": "ee",
                "mc": "mnc",
                "cm": "chem",
                "cl": "civil",
                "mh": "mech",
                "bi": "bio",
                "tt": "tt",
                "ip": "ipe",
            }

            branch = branchEmailMap[branch] || 'Unknown';
            if (branch === 'Unknown') {
                await interaction.createMessage({
                    content: `❌ Invalid branch code in your email.`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }


            let joiningYear = brokenUsername[2] || 'Unknown';
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            let yearNum = parseInt(joiningYear, 10);
            if (isNaN(yearNum)) {
                await interaction.createMessage({
                    content: `❌ Could not parse joining year from your email.`,
                    flags: Eris.Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            let academicYear = currentYear - (2000 + yearNum);
            if (currentMonth < 6) {
                academicYear -= 1;
            }

            let yearLabel: string;
            if (academicYear === 0) {
                yearLabel = 'one';
            } else if (academicYear === 1) {
                yearLabel = 'two';
            } else if (academicYear === 2) {
                yearLabel = 'three';
            } else if (academicYear === 3) {
                yearLabel = 'four';
            } else if (academicYear > 3) {
                yearLabel = 'alumni';
            } else {
                yearLabel = 'alumni';
            }
            let firstNameCapitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

            await databaseManager.registerUser(userId, `${firstNameCapitalized} ${lastName.toUpperCase()}`, branch, (2000 + yearNum).toString(), parsedEmail.original);

            await interaction.createMessage({
                content: [
                    `✅ Successfully verified as **${firstNameCapitalized}** from **<@&${roles[branch]}>** of **${2000 + yearNum}** batch!`,
                    `-# <:reply:${emoji.reply}> Granted roles: <@&${roles[branch]}> and <@&${roles[yearLabel]}>`,
                ].join('\n'),
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            })

            for (const key in roles) {
                const rId = roles[key];
                if (!['cs', 'ds', 'it', 'ece', 'vlsi', 'ice', 'ee', 'mnc', 'chem', 'civil', 'mech', 'bio', 'tt', 'ipe', 'fresher', 'one', 'two', 'three', 'four', 'alumni'].includes(key)) continue;
                if (interaction.member?.roles.includes(rId)) {
                    await interaction.member.removeRole(rId);
                }
            }

            await interaction.member?.addRole(roles[branch]);
            await interaction.member?.addRole(roles[yearLabel]);
            
            


        } catch (error) {
            console.error('Error processing modal submission:', error);
            await interaction.createMessage({
                content: `❌ An error occurred while submitting your email: ${(error as Error).message}`,
                flags: Eris.Constants.MessageFlags.EPHEMERAL
            });
        }
    }
});