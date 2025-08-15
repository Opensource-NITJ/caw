import fetch from 'node-fetch';
import Eris from 'eris';
import channels from '../../secret/channel.json';
import roles from '../../secret/roles.json';

export async function NITJAdmissionChecker(databaseManager: any, bot: Eris.Client): Promise<void> {
    let previousData: any[] = await databaseManager.getAllAdmissionUpdates();

    while (true) {
        try {
            const response = await fetch('https://www.nitj.ac.in/api/admissions/updates/get?visible=invisible&degree=BTECH');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const currentData = await response.json() as any[];

            for (const item of currentData) {
                try {
                    await databaseManager.upsertAdmissionUpdate(item);
                } catch (upsertError) {
                    console.error(`Failed to upsert record ${item._id}:`, upsertError);
                }
            }

            const newRecords = currentData.filter(
                current => !previousData.some(prev => prev.id === current._id)
            );

            console.log(`Found ${newRecords.length} new records`);

            const unacknowledged = await databaseManager.getUnacknowledgedAdmissionUpdates();

            for (const update of unacknowledged) {
                try {
                    console.log(`New admission update: ${update.title} - ${update.link}`);

                    await bot.createMessage(channels.freshersNotifer, {
                        content: `<@&${roles.staff}>`,
                        embeds: [{
                            color: 0x10141F,
                            title: update.title,
                            description: [
                                `**Debug Info:**`,
                                `> Visible: \`${update.visible}\``,
                                `> Created At: \`${update.created_at}\``,
                                `> Degree: \`${update.degree}\``,
                                `> Order: \`${update.order_num}\``,
                                `> ID: \`${update.id}\``,
                                `> Link: ${update.link}`
                            ].join(`\n`)
                        }],
                        components: [
                            {
                                type: Eris.Constants.ComponentTypes.ACTION_ROW,
                                components: [{
                                    type: Eris.Constants.ComponentTypes.BUTTON,
                                    label: 'PDF',
                                    url: update.link,
                                    style: Eris.Constants.ButtonStyles.LINK
                                },{
                                    type: Eris.Constants.ComponentTypes.BUTTON,
                                    label: 'NITJ Admission Updates',
                                    url: `https://www.nitj.ac.in/admissions/index.html#btech`,
                                    style: Eris.Constants.ButtonStyles.LINK
                                }]
                            }
                        ]
                    })

                    await databaseManager.acknowledgeAdmissionUpdate(update.id);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (processError) {
                    console.error(`Error processing update ${update.id}:`, processError);
                }
            }

            previousData = await databaseManager.getAllAdmissionUpdates();
        } catch (error) {
            console.error('Error in NITJAdmissionChecker:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}