const {SlashCommandBuilder, PermissionFlagsBits} = require("@discordjs/builders")
const {Client, Interaction} =  require("discord.js");

module.exports = { 
    /**     
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */    
    async execute(interaction) {
        // return un random entre 0 et max
        function getRandomInt(max) { 
            return Math.floor(Math.random() * max);
        }

        // make a delay
        function delay(milliseconds){ 
            return new Promise(resolve => {
                setTimeout(resolve, milliseconds);
            });
        }

        //checking member permission and bot permission
        const permissionMember = interaction.member.permissions.has("BAN_MEMBERS"); // bool ==> check if bot has permission to ban members
        if (!permissionMember) return interaction.reply("❌ | You don't have permission to use this command");

        const targetUsertype = interaction.options.getUser('target'); // targeted player (User type)
        if (targetUsertype.id === interaction.member.id) {
            return interaction.reply(`❌ | You cannot ban yourself!`); // cant ban yourself
        }
        if (targetUsertype.id === interaction.guild.ownerId) {
            return interaction.reply(`❌ | Can't ban they're owner`); // cant ban owner
        }
       

        const requestUserRolePosition = interaction.member.roles.highest.position;
        const targetUser = await interaction.guild.members.fetch(targetUsertype.id);
        const targetUserRolePosition = targetUser.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        if (requestUserRolePosition <= targetUserRolePosition ) {
            return interaction.reply(`❌ | You can't ban that user because they have same/higher role than you `);
        }
        if (botRolePosition <= targetUserRolePosition) {
            return interaction.reply(`❌ | I can't ban that user because they have same/higher role than me `);
        }
        
        //Ban state initialization
        const chooseStatusInt = getRandomInt(10); // initialise la valeur par defaut du statut de ban 
        if ((chooseStatusInt%2) == 0) var chooseStatus = true;
        else var chooseStatus = false;
        console.log(chooseStatusInt+" : "+chooseStatus);

        //Wheel phase ==> True/False for x times + Ban phase
        const iteration = getRandomInt(50);
        console.log("nb iteration : "+iteration);
        const banTime = interaction.options.getInteger('time');
        await interaction.reply("the wheel is wheeling")
        try {
            for (i = iteration; i > 0; i--) {
                chooseStatus = !chooseStatus;
                if (i > 30) {
                    await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned ? \nChoice state : ${chooseStatus}`);
                    await delay(200);
                    
                }
                else if (i > 15) {
                    await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned ? \nChoice state : ${chooseStatus}`);
                    await delay(400);
                }
                else if (i > 5) {
                    await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned ? \nChoice state : ${chooseStatus}`);
                    await delay(650);
                }
                else if (i > -1) {
                    await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned ? \nChoice state : ${chooseStatus}`);
                    await delay(1000);
                }
                console.log(i);
            }
            console.log("last choice state : "+chooseStatus);
            function timeConvert(minutes) {
                return `${Math.floor(minutes / 24 / 60)}:${Math.floor((minutes / 60) % 24)}:${Math.floor(minutes % 60)}`;
             }
            if (chooseStatus) {
                await targetUser.ban({day: timeConvert(banTime), reason: "By the Russian wheel"});
                await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned ? \nChoice state : ${chooseStatus} \n@${targetUsertype.username} was unlucky \nHikaruzs's Russian Wheel has no Mercy...`);
            }
            else {
                await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned ? \nChoice state : ${chooseStatus} \nHikaruzs's Russian Wheel hasn't given any sentance for @${targetUsertype.username} but not for long...`);
            } 
        }catch (error) {
            console.log(error);
            interaction.reply(`Erreur lors de l'execution de la commande.\nContactez le developpeur`);
        }
    
    },

    // Set Commande Data
    data: new SlashCommandBuilder()
        .setName('russian-wheel')
        .setDescription("set a chance for a user to get temporarily banned")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription('Choose a player')
                .setRequired(true))
        .addIntegerOption(option => 
            option
                .setName('time')
                .setDescription('Ban duration')
                .setRequired(true))
};