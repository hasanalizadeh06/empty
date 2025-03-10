const { AttachmentBuilder, Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const Discord = require("discord.js");

module.exports = new MessageCommand({
    command: {
        name: 'calculate',
        description: 'Replies with Pong!',
        aliases: ['c'],
        permissions: ['SendMessages']
    },
    options: {},
    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        let jobTimes = {
            baxtiyar: {time:'00 10 * * *',id:"724621100541280256"},
            tehran: {time:'00 10 * * *',id:"1017126876038312037"},
            elvin: {time:'00 10 * * *',id:"1011341934566060103"},
            kamranDev: {time:'00 10 * * *',id:"1315915709745725480"},
            hasan: {time:'30 10 * * *',id:"730860373862908071"},
            javid: {time:'00 10 * * *',id:"1229747468292456548"},
            elsen: {time:'00 10 * * *',id:"802671903445745664"},
            ilkin: {time:'00 10 * * *',id:"538756937618292747"},
            emin: {time:'00 10 * * *',id:"786935416417812560"},
            narmin: {time:'00 10 * * *',id:"1209375133161234452"},
            mehriban: {time:'00 10 * * *',id:"791590668605587476"},
            
            // aziza: '  * * *',
            // kamranSmm: '  * * *',
            // gunay: '  * * *',
            // gunel: '  * * *',
            // lale: '  * * *',
            // ramin: '  * * *',
        }
        const reply = await message.reply({ content:"Progress loading..." });
        setTimeout(() => reply.delete(), 3000);
        const now = Date.now();
        const threeMonthsAgo = now - 3 * 30 * 24 * 60 * 60 * 1000; // Approximation of 3 months in milliseconds
        const oneMonthsAgo = now - 30 * 24 * 60 * 60 * 1000; // Approximation of 3 months in milliseconds
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // Approximation of 3 months in milliseconds
        const kartlarChannel = message.guild.channels.cache.find(channel => channel.name === "kartlar");
        if (!kartlarChannel) {
            return message.reply({ content: "Channel 'kartlar' not found." });
        }
        const gecikmeChannel = message.guild.channels.cache.find(channel => channel.name === "crx-baku");
        if (!gecikmeChannel) {
            return message.reply({ content: "Channel 'crx-baku' not found." });
        }
        const standupsChannel = message.guild.channels.cache.find(channel => channel.name === "standups");
        if (!standupsChannel) {
            return message.reply({ content: "Channel 'standups' not found." });
        }
        let messagesStandups = await standupsChannel.messages.fetch({ limit: 100 });
        let messagesGecikme = await gecikmeChannel.messages.fetch({ limit: 100 });
        let messages = await kartlarChannel.messages.fetch({ limit: 100 });
        let lastMessageId = messages.last().id;
        while (true) {
            const fetchedMessages = await kartlarChannel.messages.fetch({ limit: 100, before: lastMessageId });
            if (fetchedMessages.size === 0) break;
            messages = messages.concat(fetchedMessages);
            lastMessageId = fetchedMessages.last().id;
        }

        let lastMessageIdGecikme = messagesGecikme.last().id;
        while (true) {
            const fetchedMessagesGecikme = await gecikmeChannel.messages.fetch({ limit: 100, before: lastMessageIdGecikme });
            if (fetchedMessagesGecikme.size === 0) break;
            messagesGecikme = messagesGecikme.concat(fetchedMessagesGecikme);
            lastMessageIdGecikme = fetchedMessagesGecikme.last().id;
        }
        let lastMessageIdStandups = messagesGecikme.last().id;
        while (true) {
            const fetchedMessagesStandups = await standupsChannel.messages.fetch({ limit: 100, before: lastMessageIdStandups });
            if (fetchedMessagesStandups.size === 0) break;
            messagesStandups = messagesStandups.concat(fetchedMessagesStandups);
            lastMessageIdStandups = fetchedMessagesStandups.last().id;
        }
        let filteredMessages = messages.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
        let filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
        let filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= threeMonthsAgo);

        if(message.mentions.members.size > 0){
            let controlledMember = message.mentions.members.at(0)
            const formatDate = (timestamp, standupsMessages) => {
                const date = new Date(timestamp);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const whenCome = standupsMessages.filter((m) => (new Date(m.createdTimestamp).getDate() === new Date(timestamp).getDate() && m.author.id == controlledMember.id))
                if(!whenCome.map(m => m.createdTimestamp)[0]) return {minutes: 0, whenSent:`${hours}:${minutes} ${day}.${month}.${year}`, whenCome:`Not recorded!`, lateTime: `Can't calculate!`}; 
                const whenComeDate = new Date(whenCome.map(m => m.createdTimestamp)[0]);
                const whenComeHours = String(whenComeDate.getHours()).padStart(2, '0');
                const whenComeMinutes = String(whenComeDate.getMinutes()).padStart(2, '0');
                const whenComeDay = String(whenComeDate.getDate()).padStart(2, '0');
                const whenComeMonth = String(whenComeDate.getMonth() + 1).padStart(2, '0');
                const whenComeYear = whenComeDate.getFullYear();
                
                const jobTime = Object.values(jobTimes).find(job => job.id === controlledMember.id);

                if (jobTime) {
                    const jobTimeParts = jobTime.time.split(' ');
                    const jobHour = parseInt(jobTimeParts[1], 10);
                    const jobMinute = parseInt(jobTimeParts[0], 10);
                    const jobDate = new Date(timestamp);
                    jobDate.setHours(jobHour, jobMinute, 0, 0);
                    let lateTime = (whenComeDate - jobDate) / 60000; // Calculate late time in minutes
                    if (lateTime < 0) lateTime = 0;
                    return { 
                        whenSent: `${hours}:${minutes} ${day}.${month}.${year}`, 
                        whenCome: `${whenComeHours}:${whenComeMinutes} ${whenComeDay}.${whenComeMonth}.${whenComeYear}`, 
                        lateTime: `${Math.round(lateTime)} minutes`, 
                        minutes: Math.round(lateTime) 
                    };
                }
            };
            if (args[1]) {
                let timeList = args[1].split(".")
                let calcTime = {
                    day: timeList[0],
                    month: timeList[1],
                    year: timeList[2]
                }
                const calcDate = new Date(calcTime.year, calcTime.month - 1, calcTime.day);
                const calcTimestamp = calcDate.getTime();
                filteredMessages = messages.filter(msg => msg.createdTimestamp >= calcTimestamp);
                filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= calcTimestamp);
                filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= calcTimestamp);
                const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                const days = Math.floor(totalMinutes / (24 * 60));
                const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                const minutes = totalMinutes % 60;
                const total = `${days}d ${hours}h ${minutes}m`;
                const embed = new Discord.EmbedBuilder()
                .setTitle(`From ${args[1]}`)
                .setAuthor({ name: (controlledMember.nickname || controlledMember.user.displayName), iconURL: controlledMember.user.displayAvatarURL(), url: 'https://claradix.com/az' })
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: 'Claradix Support © 2025', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                    { name: '📈 Total', value: total, inline: true }
                )
                .setColor('#ff00ff')
                .setTimestamp();
    
                let results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                    [
                        m.id, 
                        {
                            whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                            message: m.content,
                            whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                            lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                        }
                    ]
                )
                let sentMessage
                if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                    sentMessage = await message.channel.send({ embeds: [embed], files: [
                        new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                    ] });
                } else {
                    sentMessage = await message.channel.send({ embeds: [embed] });
                }
                await sentMessage.react('⬅️');
                await sentMessage.react('⏹️');
                await sentMessage.react('➡️');
                await sentMessage.react('⏰');
                const filter = (reaction, user) => ['⬅️', '⏹️', '➡️','⏰'].includes(reaction.emoji.name) && !user.bot;
                const collector = sentMessage.createReactionCollector({ filter, time: 60000 });
    
                collector.on('collect', async (reaction, user) => {
                    await reaction.users.remove(user.id);
                    if (reaction.emoji.name === '⬅️') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle("In 3 month");
                        embed.setColor("#00ff00");
                    } else if (reaction.emoji.name === '⏹️') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle("In 1 month");
                        embed.setColor("#ff0000");
                    } else if (reaction.emoji.name === '➡️') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle("Last Week");
                        embed.setColor("#0000ff");
                    } else if (reaction.emoji.name === '⏰') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= calcTimestamp);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= calcTimestamp);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= calcTimestamp);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                            
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle(`From ${args[1]}`);
                        embed.setColor("#ff00ff");
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                    }
                    if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                        await sentMessage.edit({ embeds: [embed], files: [
                            new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                        ] });
                    } else {
                        await sentMessage.edit({ embeds: [embed], files: []});
                    }
                })
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} reactions`);
                });
            } else {
                const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                const days = Math.floor(totalMinutes / (24 * 60));
                const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                const minutes = totalMinutes % 60;
                const total = `${days}d ${hours}h ${minutes}m`;
                const embed = new Discord.EmbedBuilder()
                .setTitle("In 3 month")
                .setAuthor({ name: (controlledMember.nickname || controlledMember.user.displayName), iconURL: controlledMember.user.displayAvatarURL(), url: 'https://claradix.com/az' })
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: 'Claradix Support © 2025', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                    { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                    { name: '📈 Total', value: total, inline: true }
                )
                .setColor('#00ff00')
                .setTimestamp();
    

                let results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                    [
                        m.id, 
                        {
                            whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                            message: m.content,
                            whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                            lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                        }
                    ]
                )
                let sentMessage
                if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                    sentMessage = await message.channel.send({ embeds: [embed], files: [
                        new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                    ] });
                } else {
                    sentMessage = await message.channel.send({ embeds: [embed] });
                }
                await sentMessage.react('⬅️');
                await sentMessage.react('⏹️');
                await sentMessage.react('➡️');
                const filter = (reaction, user) => ['⬅️', '⏹️', '➡️'].includes(reaction.emoji.name) && !user.bot;
                const collector = sentMessage.createReactionCollector({ filter, time: 60000 });
    
                collector.on('collect', async (reaction, user) => {
                    await reaction.users.remove(user.id);
                    if (reaction.emoji.name === '⬅️') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                            
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle("In 3 month");
                        embed.setColor("#00ff00");
                    } else if (reaction.emoji.name === '⏹️') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                            
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle("In 1 month");
                        embed.setColor("#ff0000");
                    } else if (reaction.emoji.name === '➡️') {
                        filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                        filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                        filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                        results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                            [
                                m.id, 
                                {
                                    whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                    message: m.content,
                                    whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                    lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                }
                            ]
                        )
                        const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                        const days = Math.floor(totalMinutes / (24 * 60));
                        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                        const minutes = totalMinutes % 60;
                        const total = `${days}d ${hours}h ${minutes}m`;
                        embed.setFields(
                            { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                            { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                            { name: '📈 Total', value: total, inline: true }
                        )
                        embed.setTitle("Last Week");
                        embed.setColor("#0000ff");
                    }
                    if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                        await sentMessage.edit({ embeds: [embed], files: [
                            new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                        ] });
                    } else {
                        await sentMessage.edit({ embeds: [embed], files: []});
                    }
                });
    
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} reactions`);
                });
            }
        } else if(["tam", "all", "full"].includes(args[0])){
            if(!args[1]){
                for (let id = 0; id < message.guild.memberCount; id++) {
                    const controlledMember = message.guild.members.cache.at(id);
                    if (controlledMember.id === client.user.id) continue;
                    const formatDate = (timestamp, standupsMessages) => {
                        const date = new Date(timestamp);
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const whenCome = standupsMessages.filter((m) => (new Date(m.createdTimestamp).getDate() === new Date(timestamp).getDate() && m.author.id == controlledMember.id))
                        if(!whenCome.map(m => m.createdTimestamp)[0]) return {minutes: 0, whenSent:`${hours}:${minutes} ${day}.${month}.${year}`, whenCome:`Not recorded!`, lateTime: `Can't calculate!`}; 
                        const whenComeDate = new Date(whenCome.map(m => m.createdTimestamp)[0]);
                        const whenComeHours = String(whenComeDate.getHours()).padStart(2, '0');
                        const whenComeMinutes = String(whenComeDate.getMinutes()).padStart(2, '0');
                        const whenComeDay = String(whenComeDate.getDate()).padStart(2, '0');
                        const whenComeMonth = String(whenComeDate.getMonth() + 1).padStart(2, '0');
                        const whenComeYear = whenComeDate.getFullYear();
                        
                        const jobTime = Object.values(jobTimes).find(job => job.id === controlledMember.id);
        
                        if (jobTime) {
                            const jobTimeParts = jobTime.time.split(' ');
                            const jobHour = parseInt(jobTimeParts[1], 10);
                            const jobMinute = parseInt(jobTimeParts[0], 10);
                            const jobDate = new Date(timestamp);
                            jobDate.setHours(jobHour, jobMinute, 0, 0);
                            let lateTime = (whenComeDate - jobDate) / 60000; // Calculate late time in minutes
                            if (lateTime < 0) lateTime = 0;
                            return { 
                                whenSent: `${hours}:${minutes} ${day}.${month}.${year}`, 
                                whenCome: `${whenComeHours}:${whenComeMinutes} ${whenComeDay}.${whenComeMonth}.${whenComeYear}`, 
                                lateTime: `${Math.round(lateTime)} minutes`, 
                                minutes: Math.round(lateTime) 
                            };
                        }
                    };
                    const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                    const days = Math.floor(totalMinutes / (24 * 60));
                    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                    const minutes = totalMinutes % 60;
                    const total = `${days}d ${hours}h ${minutes}m`;
                    const embed = new Discord.EmbedBuilder()
                    .setTitle("In 3 month")
                    .setAuthor({ name: (controlledMember.nickname || controlledMember.user.displayName), iconURL: controlledMember.user.displayAvatarURL(), url: 'https://claradix.com/az' })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({ text: 'Claradix Support © 2025', iconURL: client.user.displayAvatarURL() })
                    .addFields(
                        { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                        { name: '📈 Total', value: total, inline: true }
                    )
                    .setColor('#00ff00')
                    .setTimestamp();
                    
                    let results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                        [
                            m.id, 
                            {
                                whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                message: m.content,
                                whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                            }
                        ]
                    )
                    let sentMessage
                    if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                        sentMessage = await message.channel.send({ embeds: [embed], files: [
                            new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                        ] });
                    } else {
                        sentMessage = await message.channel.send({ embeds: [embed] });
                    }
                    await sentMessage.react('⬅️');
                    await sentMessage.react('⏹️');
                    await sentMessage.react('➡️');
                    const filter = (reaction, user) => ['⬅️', '⏹️', '➡️'].includes(reaction.emoji.name) && !user.bot;
                    const collector = sentMessage.createReactionCollector({ filter, time: 60000 });
        
                    collector.on('collect', async (reaction, user) => {
                        await reaction.users.remove(user.id);
                        if (reaction.emoji.name === '⬅️') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle("In 3 month");
                            embed.setColor("#00ff00");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        } else if (reaction.emoji.name === '⏹️') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                                
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle("In 1 month");
                            embed.setColor("#ff0000");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        } else if (reaction.emoji.name === '➡️') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                            
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle("Last Week");
                            embed.setColor("#0000ff");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        }
                        if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                            await sentMessage.edit({ embeds: [embed], files: [
                                new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                            ] });
                        } else {
                            await sentMessage.edit({ embeds: [embed], files: [] });
                        }
                    });
        
                    collector.on('end', collected => {
                        console.log(`Collected ${collected.size} reactions`);
                    });
                }
            } else {
                let timeList = args[1].split(".")
                let calcTime = {
                    day: timeList[0],
                    month: timeList[1],
                    year: timeList[2]
                }
                const calcDate = new Date(calcTime.year, calcTime.month - 1, calcTime.day);
                const calcTimestamp = calcDate.getTime();
                filteredMessages = messages.filter(msg => msg.createdTimestamp >= calcTimestamp);
                filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= calcTimestamp);
                filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= calcTimestamp);
                for (let id = 0; id < message.guild.memberCount; id++) {
                    const controlledMember = message.guild.members.cache.at(id);
                    if (controlledMember.id === client.user.id) continue;
                    const formatDate = (timestamp, standupsMessages) => {
                        const date = new Date(timestamp);
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const whenCome = standupsMessages.filter((m) => (new Date(m.createdTimestamp).getDate() === new Date(timestamp).getDate() && m.author.id == controlledMember.id))
                        if(!whenCome.map(m => m.createdTimestamp)[0]) return {minutes: 0, whenSent:`${hours}:${minutes} ${day}.${month}.${year}`, whenCome:`Not recorded!`, lateTime: `Can't calculate!`}; 
                        const whenComeDate = new Date(whenCome.map(m => m.createdTimestamp)[0]);
                        const whenComeHours = String(whenComeDate.getHours()).padStart(2, '0');
                        const whenComeMinutes = String(whenComeDate.getMinutes()).padStart(2, '0');
                        const whenComeDay = String(whenComeDate.getDate()).padStart(2, '0');
                        const whenComeMonth = String(whenComeDate.getMonth() + 1).padStart(2, '0');
                        const whenComeYear = whenComeDate.getFullYear();
                        
                        const jobTime = Object.values(jobTimes).find(job => job.id === controlledMember.id);
        
                        if (jobTime) {
                            const jobTimeParts = jobTime.time.split(' ');
                            const jobHour = parseInt(jobTimeParts[1], 10);
                            const jobMinute = parseInt(jobTimeParts[0], 10);
                            const jobDate = new Date(timestamp);
                            jobDate.setHours(jobHour, jobMinute, 0, 0);
                            let lateTime = (whenComeDate - jobDate) / 60000; // Calculate late time in minutes
                            if (lateTime < 0) lateTime = 0;
                            return { 
                                whenSent: `${hours}:${minutes} ${day}.${month}.${year}`, 
                                whenCome: `${whenComeHours}:${whenComeMinutes} ${whenComeDay}.${whenComeMonth}.${whenComeYear}`, 
                                lateTime: `${Math.round(lateTime)} minutes`, 
                                minutes: Math.round(lateTime) 
                            };
                        }
                    };
                    const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                    const days = Math.floor(totalMinutes / (24 * 60));
                    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                    const minutes = totalMinutes % 60;
                    const total = `${days}d ${hours}h ${minutes}m`;
                    const embed = new Discord.EmbedBuilder()
                    .setTitle(`From ${args[1]}`)
                    .setAuthor({ name: (controlledMember.nickname || controlledMember.user.displayName), iconURL: controlledMember.user.displayAvatarURL(), url: 'https://claradix.com/az' })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({ text: 'Claradix Support © 2025', iconURL: client.user.displayAvatarURL() })
                    .addFields(
                        { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                        { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                        
                        { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                        { name: '📈 Total', value: total, inline: true }
                    )
                    .setColor('#ff00ff')
                    .setTimestamp();
                    
                    let results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                        [
                            m.id, 
                            {
                                whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                message: m.content,
                                whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                            }
                        ]
                    )
                    let sentMessage
                    if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                        sentMessage = await message.channel.send({ embeds: [embed], files: [
                            new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                        ] });
                    } else {
                        sentMessage = await message.channel.send({ embeds: [embed] });
                    }
                    await sentMessage.react('⬅️');
                    await sentMessage.react('⏹️');
                    await sentMessage.react('➡️');
                    await sentMessage.react('⏰');
                    const filter = (reaction, user) => ['⬅️', '⏹️', '➡️', '⏰'].includes(reaction.emoji.name) && !user.bot;
                    const collector = sentMessage.createReactionCollector({ filter, time: 60000 });
        
                    collector.on('collect', async (reaction, user) => {
                        await reaction.users.remove(user.id);
                        if (reaction.emoji.name === '⬅️') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= threeMonthsAgo);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                                
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle("In 3 month");
                            embed.setColor("#00ff00");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        } else if (reaction.emoji.name === '⏹️') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneMonthsAgo);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                                
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle("In 1 month");
                            embed.setColor("#ff0000");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        } else if (reaction.emoji.name === '➡️') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= oneWeekAgo);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                                
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle("Last Week");
                            embed.setColor("#0000ff");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        } else if (reaction.emoji.name === '⏰') {
                            filteredMessages = messages.filter(msg => msg.createdTimestamp >= calcTimestamp);
                            filteredMessagesGecikme = messagesGecikme.filter(msg => msg.createdTimestamp >= calcTimestamp);
                            filteredMessagesStandups = messagesStandups.filter(msg => msg.createdTimestamp >= calcTimestamp);
                            const totalMinutes = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => formatDate(m.createdTimestamp, filteredMessagesStandups).minutes).reduce((a, b) => a + b, 0);
                            const days = Math.floor(totalMinutes / (24 * 60));
                            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                            const minutes = totalMinutes % 60;
                            const total = `${days}d ${hours}h ${minutes}m`;
                            embed.setFields(
                                { name: '- 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '- 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("-") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟨', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟨") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟥', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟥") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },
                                { name: '+ 🟩', value: `${filteredMessages.filter((m) => (m.content.includes("+") && m.content.includes("🟩") && m.mentions.members.has(controlledMember.id) && m.author.id !== client.user.id)).size}`, inline: true },                                
                                { name: '💤 Late', value: `${filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size} times`, inline: true },
                                { name: '📈 Total', value: total, inline: true }
                            )
                            embed.setTitle(`From ${args[1]}`);
                            embed.setColor("#ff00ff");
                            results = filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).map(m => 
                                [
                                    m.id, 
                                    {
                                        whenSent: formatDate(m.createdTimestamp, filteredMessagesStandups).whenSent,
                                        message: m.content,
                                        whenCome: formatDate(m.createdTimestamp, filteredMessagesStandups).whenCome,
                                        lateTime: formatDate(m.createdTimestamp, filteredMessagesStandups).lateTime
                                    }
                                ]
                            )
                        }
                        if(filteredMessagesGecikme.filter((m) => (m.content.includes("RL") && m.author.id == controlledMember.id)).size != 0){
                            await sentMessage.edit({ embeds: [embed], files: [
                                new AttachmentBuilder(Buffer.from(`${JSON.stringify(Object.fromEntries(results), null, 2)}`, 'utf-8'), { name: (controlledMember.nickname || controlledMember.user.displayName)+'.json' })    
                            ] });
                        } else {
                            await sentMessage.edit({ embeds: [embed], files: [] });
                        }
                    });
        
                    collector.on('end', collected => {
                        console.log(`Collected ${collected.size} reactions`);
                    });
                }
            }
        } else {
            const embed = new Discord.EmbedBuilder()
            .setTitle(`Mention someone or write all`)
            .setColor('#00ff00')
            .setFooter({ text: 'Claradix Support © 2025', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();
            const reply = await message.reply({ embeds: [embed] });
            setTimeout(() => reply.delete(), 5000);
        }
    }
}).toJSON();