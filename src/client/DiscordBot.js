const { Client, Collection, Partials } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, info, success } = require("../utils/Console");
const config = require("../config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const { QuickYAML } = require('quick-yaml.db');
const db = require('quick.db'); // Ensure quick.db is required
const schedule = require('node-schedule');

class DiscordBot extends Client {
    collection = {
        application_commands: new Collection(),
        message_commands: new Collection(),
        message_commands_aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        }
    }
    rest_application_commands_array = [];
    login_attempts = 0;
    login_timestamp = 0;
    statusMessages = [
        { name: 'Claradix', type: 4 },
        { name: 'We are the bridge between your idea and reality', type: 4 },
        { name: 'Join to us :)', type: 4 }
    ];

    commands_handler = new CommandsHandler(this);
    components_handler = new ComponentsHandler(this);
    events_handler = new EventsHandler(this);
    database = new QuickYAML(config.database.path);

    constructor() {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],
            presence: {
                activities: [{
                    name: 'keep this empty',
                    type: 4,
                    state: 'DiscordJS-V14-Bot-Template v3'
                }]
            }
        });
        
        new CommandsListener(this);
        new ComponentsListener(this);
    }

    startStatusRotation = async () => {
        const client = this

        let index = 0;
        let jobTimes = {
            baxtiyar: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"724621100541280256"
                },
            tehran: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"1017126876038312037"
                },
            elvin: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"1011341934566060103"
                },
            kamranDev: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"1315915709745725480"
                },
            hasan: 
                {
                    // time:'00 10 * * *',
                    time:'30 10 * * *',
                    id:"730860373862908071"
                },
            javid: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"1229747468292456548"
                },
            elsen: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"802671903445745664"
                },
            ilkin: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"538756937618292747"
                },
            emin: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"786935416417812560"
                },
            narmin: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"1209375133161234452"
                },
            mehriban: 
                {
                    // time:'30 09 * * *',
                    time:'00 10 * * *',
                    id:"791590668605587476"
                },
            
            // aziza: '  * * *',
            // kamranSmm: '  * * *',
            // gunay: '  * * *',
            // gunel: '  * * *',
            // lale: '  * * *',
            // ramin: '  * * *',
        }

        function doTest(memberId, jobTime) {
            const time = new Date();
            time.setHours(jobTime.hour);
            time.setMinutes(jobTime.minute);
            schedule.scheduleJob(time, async () => {
                const guildLog = client.channels.cache.find(channel => channel.name === "guild-log");
                const channel = client.channels.cache.find(channel => channel.name === "standups");
                const today = new Date().toISOString().slice(0, 10);
                const memberInChannel = channel.guild.members.cache.get(memberId);
                const messages = await channel.messages.fetch({ limit: 100 });
                const memberMessages = messages.filter(msg => msg.author.id === memberId && msg.createdAt.toISOString().slice(0, 10) === today);
                if (memberMessages.size > 0) {
                    const messageTimestamp = memberMessages.map(m => m)[0].createdTimestamp;
                    const date = new Date(messageTimestamp);
                    const time = `${date.getHours()}:${date.getMinutes()}`;
                    guildLog.send(`> 🟢 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** started working at \`${time}\``);
                } else {
                    guildLog.send(`> 🔴 Where is **${(memberInChannel.nickname || memberInChannel.user.displayName)}** ?`);
                }
            })
        }

        // client.on('messageCreate', message => {
        //     if (message.channel.name === 'crx-baku') {
        //         if (message.content.includes('RL')) {
        //             const guildLog = client.channels.cache.find(channel => channel.name === "guild-log");
        //             guildLog.send(`**${message.author.username}** will be late.`);
        //             const jobTime = Object.values(jobTimes).find(e => e.id === message.author.id).time.split(" ")[1];
        //             doTest(message.author.id, { hour: Number(jobTime.split(":")[0]), minute: Number(jobTime.split(":")[1])+2 });
        //             return;
        //         }
        //     }
        // });

        for (const key of Object.keys(jobTimes)) {
            const member = jobTimes[key];
            schedule.scheduleJob(member.time, async () => {
                const date = new Date();
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 3 || dayOfWeek === 6 || dayOfWeek === 0) return;
                const channel = this.channels.cache.find(channel => channel.name === "standups");
                const guildLog = this.channels.cache.find(channel => channel.name === "guild-log");
                const statusChannel = this.channels.cache.find(channel => channel.name === "tətil-xəstə-bayram");
                const today = new Date().toISOString().slice(0, 10);
                const memberInChannel = channel.guild.members.cache.get(member.id);
                const messages = await channel.messages.fetch({ limit: 100 });
                const statusMessages = await statusChannel.messages.fetch({ limit: 100 });
                const memberMessagesStatus = statusMessages.filter(msg => msg.author.id === member.id && msg.createdAt.toISOString().slice(0, 10) === today);
                const memberMessages = messages.filter(msg => msg.author.id === member.id && msg.createdAt.toISOString().slice(0, 10) === today);
                const crxBakuChannel = this.channels.cache.find(channel => channel.name === "crx-baku");
                const crxBakuMessages = await crxBakuChannel.messages.fetch({ limit: 100 });
                const memberCrxBakuMessages = crxBakuMessages.filter(msg => msg.author.id === member.id && msg.content.includes('RL') && msg.createdAt.toISOString().slice(0, 10) === today);
                if (memberMessagesStatus.size == 0) {
                    if (memberMessages.size > 0) {
                        const messageTimestamp = memberMessages.map(m => m)[0].createdTimestamp;
                        const date = new Date(messageTimestamp);
                        const time = `${date.getHours()}:${date.getMinutes()}`;
                        guildLog.send(`> 🟢 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** started working at \`${time}\``);
                    } else {
                        if (memberCrxBakuMessages.size > 0) {
                            guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** will be late.`);
                            const now = new Date();
                            now.setHours(now.getHours() + 1);
                            doTest(member.id, { hour: now.getHours(), minute: now.getMinutes()});
                        } else {
                            guildLog.send(`> 🔴 Where is **${(memberInChannel.nickname || memberInChannel.user.displayName)}** ?`);
                        }
                    }
                } else {
                    memberMessagesStatus.forEach(msg => {
                        if (msg.content.toLowerCase().includes("wfh")) {
                            guildLog.send(`> 🟢 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`working from home\``);
                        } else if (msg.content.toLowerCase().includes("off")) {
                            if (msg.content.includes("10")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 10, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 10:30 AM\``);
                                } else {
                                    doTest(member.id, {hour: 10, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 10 AM\``);
                                }
                            } else if (msg.content.includes("11")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 11, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 11:30 AM\``);
                                } else {
                                    doTest(member.id, {hour: 11, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 11 AM\``);
                                }
                            } else if (msg.content.includes("12")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 12, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 12:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 12, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 12 PM\``);
                                }
                            } else if (msg.content.includes("13") || msg.content.includes("1")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 13, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 1:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 13, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 1 PM\``);
                                }
                            } else if (msg.content.includes("14") || msg.content.includes("2")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 14, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 2:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 14, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 2 PM\``);
                                }
                            } else if (msg.content.includes("15") || msg.content.includes("3")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 15, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 3:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 15, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 3 PM\``);
                                }
                            } else if (msg.content.includes("16") || msg.content.includes("4")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 16, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 4:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 16, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 4 PM\``);
                                }
                            } else if (msg.content.includes("17") || msg.content.includes("5")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 17, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 5:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 17, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 5 PM\``);
                                }
                            } else if (msg.content.includes("18") || msg.content.includes("6")) {
                                if (msg.content.includes("30")) {
                                    doTest(member.id, {hour: 18, minute: 30})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 6:30 PM\``);
                                } else {
                                    doTest(member.id, {hour: 18, minute: 0})
                                    guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off until 6 PM\``);
                                }
                            } else {
                                guildLog.send(`> 🟡 **${(memberInChannel.nickname || memberInChannel.user.displayName)}** is \`off today\``);
                            }
                        }
                    });
                }
            });
        }

        setInterval(() => {
            this.user.setPresence({ activities: [this.statusMessages[index]] });
            index = (index + 1) % this.statusMessages.length;
        }, 4000);
    }

    connect = async () => {
        warn(`Attempting to connect to the Discord bot... (${this.login_attempts + 1})`);

        this.login_timestamp = Date.now();

        try {
            await this.login(process.env.CLIENT_TOKEN);
            this.commands_handler.load();
            this.components_handler.load();
            this.events_handler.load();
            this.startStatusRotation();

            warn('Attempting to register application commands... (this might take a while!)');
            await this.commands_handler.registerApplicationCommands(config.development);
            success('Successfully registered application commands. For specific guild? ' + (config.development.enabled ? 'Yes' : 'No'));
        } catch (err) {
            error('Failed to connect to the Discord bot, retrying...');
            error(err);
            this.login_attempts++;
            setTimeout(this.connect, 5000);
        }
    }
}

module.exports = DiscordBot;