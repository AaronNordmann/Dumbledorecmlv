//======================================================================================
/*
	This is a Dicord Bot for SAMP Servers written in Node.js
	Bot Version: 2.1
	Author: Abhay SV Aka DuskFawn Aka Perfectboy. 
*/
//=======================================================================================

//______________________[Discord JS and SAMP Query Library]______________________________
const Discord = require('discord.js');
const client = new Discord.Client();

var query = require('samp-query');

//_____________________________[BOT Configuration]_________________________________________
//@audit Settings

const botChar = "?"; // Bot prefix character
let Samp_IP = "server.cmlv-rp.com";
let Samp_Port = 2600;
let Community_Tag ="CMLV";

let userToSubmitApplicationsTo = '725035439412477982';//Default Channel Id for User Applications
let reportChannelID = '703642258414633011'; // Channel for the ingam reports
let adminCmdsChannelID = '709558295496753223'; // Admin Cmds channel
let Bot_debug_mode = false;

//_______________________________[APPLICATIONS]______________________________________________
let applicationQuestions = require("./application-questions.js"); //This .js file has the default questions
let usersApplicationStatus = [];
let appNewForm = [];
let isSettingFormUp = false;

//______________________________[SAMP Server MySQL Connection]________________________________
const mysql = require("mysql");
var db = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
});


//_______________________________[BOT Startup]_________________________________________________
//@audit-ok Client Ready
client.on('ready', () => {

    console.log('Dumbledore vien de se reveiller!');
	console.log(`Logged in as ${client.user.tag}!`);
	setTimeout(getLastReportId, 10000000);
	setInterval(ReportSync, 20000000);
	

});
//-----------------------------[Debug]-----------------------------------
function toggle_debug() 
{
	if (Bot_debug_mode) 
	{
	  Bot_debug_mode = false;
	  console.log(`[DEBUG]: Debug Mode Disabled`);
	} 
	else 
	{
	  Bot_debug_mode = true;
	  console.log(`[DEBUG]: Debug Mode Enabled`);
	}
}

//________________________[Inagme Report Sync]_____________________________
//@audit-info Report Sys

var last_report = 0;
function getLastReportId()
{
    db.query("SELECT * FROM `log_reports` ORDER BY `log_reports`.`id` DESC LIMIT 1",
     [], function(err,row) {
		if(row)
		{ 
			last_report = parseInt(row[0].id);
			if(Bot_debug_mode)
				console.log(`[DEBUG]Last Report id:${last_report}`);
		}
		else 
			console.log(`[ERROR]SQL Error(GetLastReportId):${err}`);
	
	});

}
function ReportSync()
{
    db.query(`SELECT * FROM log_reports WHERE id > ${last_report}`,
     [], function(err,row) {
		if(row)
		{ 
			for (var i = 0; i < row.length; i++) 
			{
				last_report = parseInt(row[i].id);
				const embedColor = 0xff0000;
			
				const logMessage = {
					embed: {
						title: row[i].report,
						color: embedColor,
						fields: [
							{ name: 'Time:', value: row[i].time, inline: true },
						],
					}
				};
				client.channels.get(reportChannelID).send(logMessage);
			
			}
			if(!row.length && Bot_debug_mode)
				console.log(`[DEBUG] No New Reports Found Using ${last_report}`)
		}
		else 
			console.log(`[ERROR]SQL Error(GetLastReportId):${err}`);
	
	});

}
//________________________[Inagme Functions]_____________________________
function GetPlayersOnline(msg) 
{
	var options = {
		host: Samp_IP,
		port: Samp_Port
	}
	//console.log(options.host)
	query(options, function (error, response) {
		if(error)
		{
			console.log(error)
			const embedColor = 0xff0000;
			
			const logMessage = {
				embed: {
					title: 'Service indisponible, réessayez plus tard!',
					color: embedColor,
					fields: [
						{ name: 'Erreur:', value: error, inline: true },
					],
				}
			}
			msg.channel.send(logMessage)
			
		}    
		/* else
		{   
			var str = "Information serveur:";
			var value = str.concat(' IP: ',response['address'],' Joueurs connectés: ',response['online'],'/',response['maxplayers']); 
			const embedColor = 0xC3BEFF;

			const logMessage = {
				embed: {
					title: 'Information serveur',
					color: embedColor,
					fields: [
						{ name: 'Serveur IP', value: response['address'], inline: true },
						{ name: 'Joueurs connectés', value: response['online'], inline: true },
						{ name: 'Slots', value: response['maxplayers'], inline: true },
					],
				}
			}
			msg.channel.send(logMessage)
			if(Bot_debug_mode)
				console.log(value)
		}    
	})

}*/
		else
		{   
			var str = "Information serveur:";
			var value = str.concat(' Nom: ',response['hostname'],' IP: ',response['address'],' Joueurs: ',response['online'], ' Slots: ', response['maxplayers'], ' Version: ',response['gamemode']); 
			const embedColor = 0xa3b19a;
			
			const logMessage = {
				embed: {
					title: 'CeMondeLeVotre - Le meilleur serveur, tu parles de ça?',
					color: embedColor,
					fields: [
						{ name: 'Nom', value: response['hostname'], inline: true},
						{ name: 'IP', value: 'server.cmlv-rp.com:2600', inline: true},
						{ name: 'Joueurs', value: response['online'], inline: true},
						{ name: 'Slots', value: response['maxplayers'], inline: true},
						{ name: 'Version', value: response['gamemode'], inline: true},
						{ name: 'SAMP', value:'0.3DL', inline: true},
						{ name: 'Lien SAMP+Cache+Jeu', value:'https://forum.cmlv-rp.com/t367516-', inline: true},
						{ name: 'Fondateur', value:'Al_Caponi#5839', inline: true},
						{ name: 'Crée', value:'08/2008', inline: true},
					],
				}
			}
			msg.channel.send(logMessage)
			if(Bot_debug_mode)
				console.log(value)
		}    
	})

}
// rajout 
function GetPlayersInGame(msg) 
{
	var options = {
		host: Samp_IP,
		port: Samp_Port
	}
	//console.log(options.host)
	query(options, function (error, response) {
		if(error)
		{
			console.log(error)
			const embedColor = 0xff0000;
			
			const logMessage = {
				embed: {
					title: 'Service indisponible, réessayez plus tard!',
					color: embedColor,
					fields: [
						{ name: 'Erreur:', value: error, inline: true },
					],
				}
			}
			msg.channel.send(logMessage)
			
		}    
		
		else
		{   
			var str = "Joueurs connectés InGame:";
			var value = str.concat(' Joueurs: ',response['players']); 
			
			msg.channel.send("**Joueurs actuellement connectés In-Game** - IP: server.cmlv-rp.com:2600\nPour limiter le flood sur Discord, envoyez un message privé à Bob (?joueurs) pour connaitre les joueurs connectés !\n");
			msg.channel.send("['players']"); 
			}
			if(Bot_debug_mode)
				console.log(value)
		   
	})

}
//@audit-info BAN Functions
function sBAN(msg,params)
{
	permcheck = (msg.channel.id === adminCmdsChannelID) ? true : false;
	if (params && permcheck) 
    {
		var sqlq;
		if(!isNaN(params))
			sqlq = `SELECT * FROM banlog WHERE name = '${params}' OR id = '${params}' LIMIT 1`;
		else sqlq = `SELECT * FROM banlog WHERE name = '${params}' LIMIT 1`;

		db.query(sqlq,
		[], function(err,row) {
		   if(row)
		   { 	if(Bot_debug_mode)
					console.log(sqlq);
				if(row.length)
				{
					if(Bot_debug_mode)
						console.log(`[DEBUG]Ban ID:${parseInt(row[0].id)}`);
					const embedColor = 0xffff00;
					const date = new Date(row[0].bantime * 1000);
					const logMessage = {
						embed: {
							title: `Active Ban Forund on Account ${row[0].name}`,
							color: embedColor,
							fields: [
								{ name: 'Ban ID', value: row[0].id, inline: true },
								{ name: 'Admin', value: row[0].admin, inline: true },
								{ name: 'Reason', value: row[0].reason, inline: true },
								{ name: 'Expiry(EPOCH)', value: date, inline: true },
							],
						}
					}
					client.channels.get(adminCmdsChannelID).send(logMessage);
				}
				else
				client.channels.get(adminCmdsChannelID).send("No ban found !!!");   
		   }
		   else 
			   console.log(`[ERROR]SQL Error(sBAN):${err}`);
	   
	   	});
  
	} else if (!permcheck) {
		msg.reply("Cette commande n'est disponible que pour les admins !\nEn cas de récidive, votre compte sera automatiquement banni.");
	} else {
		msg.channel.send("Usage : /sban [BAN-ID/InGame-Name].");
	}
	
}

function uBAN(msg,params)
{
	permcheck = (msg.channel.id === adminCmdsChannelID) ? true : false;
	if (params && permcheck) 
    {
		var sqlq;
		if(!isNaN(params))
			sqlq = `SELECT * FROM banlog WHERE name = '${params}' OR id = '${params}' LIMIT 1`;
		else sqlq = `SELECT * FROM banlog WHERE name = '${params}' LIMIT 1`;

		db.query(sqlq,
		[], function(err,row) {
		   if(row)
		   { 	if(Bot_debug_mode)
					console.log(sqlq);
				if(row.length)
				{
					if(Bot_debug_mode)
						console.log(`[DEBUG]BAN id:${parseInt(row[0].id)}`);
					uBAN_Process(row[0].id)
					
				}
				else
				client.channels.get(adminCmdsChannelID).send("No ban found !!!");   
		   }
		   else 
			   console.log(`[ERROR]SQL Error(uBAN):${err}`);
	   
	   	});
  
	} else if (!permcheck) {
		msg.reply("Cette commande n'est disponible que pour les admins !\nEn cas de récidive, votre compte sera automatiquement banni.");
	} else {
		msg.channel.send("Usage : /unban [BAN-ID/InGame-Name].");
	}
	
}
function uBAN_Process(banid)
{

	var sqlq;
	sqlq = `DELETE FROM banlog WHERE id = '${banid}'`;
		
	db.query(sqlq,
	[], function(err,row) {
		if(row)
		{ 	
			if(Bot_debug_mode)
				console.log(sqlq);
			client.channels.get(adminCmdsChannelID).send(`The user has been unbanned`); 
		}
		else 
			console.log(`[ERROR]SQL Error(uBAN_Process):${err}`);
	   
	});
  
	
}

//_____________________[APPLICATION SYSTEM FUCNTIONS]_____________________________________

const applicationFormCompleted = (data) => {
	let i = 0, answers = "";

	for (; i < applicationQuestions.length; i++) {
		answers += `${applicationQuestions[i]}: ${data.answers[i]}\n`;
	}

    const embedColor = 0xffff00;

    const logMessage = {
        embed: {
            title: `Rôle Membre Communauté -- ${Community_Tag}\nVérification de ${data.user.tag} -- ID: ${data.user.id}`,
            color: embedColor,
            fields: [
                { name: 'Veuillez procéder à la vérification de la demande:\nSi les réponses sont valides, attribuez lui le(s) rôle(s).\n\n', value: answers, inline: true },
            ],
        }
    }
    client.channels.get(userToSubmitApplicationsTo).send(logMessage);
};

const addUserToRole = (msg, roleName) => {
	if (roleName === "Admin") {
		msg.reply("Arrête d'essayer de commettre une mutinerie !")
		return;
	}

	if (roleName && msg.guild) {
		const role = msg.guild.roles.find("name", roleName);

		if (!role) {
			msg.member.addRole(role);

			msg.reply(`Added you to role: '${roleName}'`);
		} else {
			msg.reply(`Role '${roleName}' does not exist.`);
		}
	} else if (!msg.guild) {
		msg.reply("This command can only be used in a guild.");
	} else {
		msg.reply("Please specify a role.");
	}
};

const sendUserApplyForm = (msg, appName) => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

    if (appName && msg.guild) 
    {
		
        if (!user) {
            msg.author.send(`Salut, tu es sur le point de demander une vérification à l'équipe administrative du Discord **CeMondeLeVotre**.\nVous recevrez en retour le rôle **Membre Communauté** pour pouvoir échanger avec les joueurs si elle approuvée.\n\nCommandes possibles: \`\`\`${botChar}annuler : permet d'interrompre la vérification\n${botChar}restart : permet de recommencer la vérification\`\`\`\n\nSi vous êtes prêt, vous pouvez répondre aux questions ci-dessous !\n\n`);
            msg.author.send(applicationQuestions[0]);
            usersApplicationStatus.push({id: msg.author.id, currentStep: 0, answers: [], user: msg.author});
            msg.channel.send(`Vous avez reçu un message privé, répondez-y pour débuter la vérification !\n Si vous n'avez rien reçu, activez les messages provenants du serveur depuis vos paramètres.`);
        } else if(applicationQuestions[user.currentStep]) {
            msg.author.send(applicationQuestions[user.currentStep]);
        } else {
            msg.channel.send(`Vous avez déjà soumis une approbation. Celle-ci est en cours de vérification par notre équipe administrive !\nIl est inutile de les relancer, celles-ci sont traitées fréquemment.`);
        }

	} /* else if (!msg.guild) {
		msg.reply("This command can only be used in a guild.");
	}*/ else {
		msg.reply(`Utilisation : ${botChar}verif [role]. \n Vérifications possibles pour le rôle: ${Community_Tag} \n Exemple: ${botChar}verif ${Community_Tag} `);
	}
    
    

};
//@tsd
const cancelUserApplicationForm = (msg, isRedo = false) => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (user) {
		usersApplicationStatus = usersApplicationStatus.filter(el => el.id !== user.id)
		msg.reply(`Vous avez annulé le processus de vérification !\nPour recommencer, il vous faut à nouveau **${botChar}verif** dans le salon attente-permission sur le Discord de CMLV.`);
	} else if (!isRedo) {
		msg.reply(`Vous n'avez pas encore commencé le processus de vérification !\nUtilisez **${botChar}verif ${Community_Tag} pour débuter celle-ci si automatiquement.`);
	}
};

const applicationFormSetup = (msg) => {
	if (!msg.guild) {
		msg.reply("Vous n'avez pas la permission pour faire cela !");
		return;
	}

	if (!msg.member.roles.find("name", "Admin")) {
		msg.reply("Cette commande ne vous est pas accessible.");
		return;
	}

	if (isSettingFormUp) {
		msg.reply("Quelqu'un est déjà entrain de configurer le processus de vérification !");
		return;
	}

	appNewForm = [];
	isSettingFormUp = msg.author.id;

	msg.author.send(`Entrez les questions et \`${botChar}endsetup\` quand c'est terminé!`);
};

const endApplicationFormSetup = (msg) => {
	if (isSettingFormUp !== msg.author.id) {
		msg.reply("Vous n'êtes pas entrain de configurer le processus de vérification");
		return;
	}

	isSettingFormUp = false;
	applicationQuestions = appNewForm;
};


//______________________[APP-SYS END]___________________________________

//_______________________[GENERAL UTILITY CMDS]______________________________
//@audit-info Utility Cmds
const Clear_Messages = (msg,amount) => {

	if (!msg.guild) return msg.reply("This command can only be used in a guild.");

	if (!amount) return msg.channel.send("Usage: /clear [no of messages to clear]");
	
	if (isNaN(amount)) return msg.reply('The amount parameter isn`t a number!'); 

	if (amount > 100) return msg.reply('You can`t delete more than 100 messages at once!'); 
	if (amount < 1) return msg.reply('You have to delete at least 1 message!'); 


	if (!msg.channel.permissionsFor(msg.author).hasPermission("MANAGE_MESSAGES")) 
	{
        msg.channel.sendMessage("Sorry, you don't have the permission to execute the command \""+msg.content+"\"");
        return;
	} else if (!msg.channel.permissionsFor(client.user).hasPermission("MANAGE_MESSAGES")) 
	{
        msg.channel.sendMessage("Sorry, I don't have the permission to execute the command \""+msg.content+"\"");
        return;
    }

    
    if (msg.channel.type == 'text') {
        msg.channel.fetchMessages({limit : amount})
          .then(messages => {
            msg.channel.bulkDelete(messages);
            messagesDeleted = messages.array().length;

            msg.channel.sendMessage("Deletion of messages successful. Total messages deleted: "+messagesDeleted);
            console.log('Deletion of messages successful. Total messages deleted: '+messagesDeleted)
          })
          .catch(err => {
            console.log('Error while doing Bulk Delete');
            console.log(err);
        });
    }
	msg.channel.send(`No of messaes deleted ${amount}`)
};
const setChannel = (msg,param) => {
	if (!msg.guild) 
	{
		msg.reply("This command can only be used in a guild.");
		return;
	}

	if (!msg.member.roles.find("name", "Admin")) 
	{
		msg.reply("Only Members with Role **Admin** can do this.")
		return;
	}

	if(!param)
	{
		msg.channel.send("Usage: /setchannel [options] \n Avaliabe Options: reports apps adminchannel")
		return;
	}

	if(param == "reports")
	{
	reportChannelID = msg.channel.id;
	msg.channel.send("Ingame Reports will now be sent to this channel.")
	}
	if(param == "apps")
	{
	userToSubmitApplicationsTo = msg.channel.id;
	msg.channel.send("Form submissions will now be sent to this channel.")
	}
	if(param == "adminchannel")
	{
	adminCmdsChannelID = msg.channel.id;
	msg.channel.send("Admins can now use this channel for admin cmds.")
	}
};
const setSampIP = (msg,param) => {
	if (!msg.guild) 
	{
		msg.reply("This command can only be used in a guild.");
		return;
	}

	if (!msg.member.roles.find("name", "Admin")) 
	{
		msg.reply("Only Members with Role **Admin** can do this.")
		return;
	}

	if(!param)
	{
		msg.channel.send("Usage: /setip [ip without port] \n Example: /setip 127.0.0.1")
		return;
	}

	Samp_IP = param;
	msg.channel.send(`Server IP Set To : ${Samp_IP}`);

};
const setSampPort = (msg,param) => {
	if (!msg.guild) 
	{
		msg.reply("This command can only be used in a guild.");
		return;
	}

	if (!msg.member.roles.find("name", "Admin")) 
	{
		msg.reply("Only Members with Role **Admin** can do this.")
		return;
	}

	if(!param)
	{
		msg.channel.send("Usage: /setport [port] \n Example: /setport 7777")
		return;
	}
	if(!isNaN(param))
	{
		Samp_Port = Number(param);
		msg.channel.send(`Server Port Set To : ${Samp_Port}`);
	}	
	

};
const helpinfo = (msg) => {
	if (!msg.guild) 
	{
		msg.reply("This command can only be used in a guild.");
		return;
	}
	const embedColor = 0xffff00;
	pcmds = `\`\`\`${botChar}apply, ${botChar}players, ${botChar}ip, ${botChar}help\`\`\``;
	acmds = `\`\`\`${botChar}setip, ${botChar}setport, ${botChar}setchannel, ${botChar}setup, ${botChar}sban, ${botChar}unban, ${botChar}clear\`\`\``;

    const logMessage = {
        embed: {
            title: `Discord Bot DumbleDore Help Info`,
            color: embedColor,
            fields: [
				{ name: 'Player Cmds', value: pcmds, inline: true },
				{ name: 'Admin Cmds', value: acmds, inline: true },
            ],
        }
    }

	msg.channel.send(logMessage);

};


//______________________[COMMAND PROCESSOR]__________________________________
//@audit-ok Commands

client.on('message', msg => {

	//------------------------------[Medthod 1 For cmds]--------------------------------
    if (msg.content === 'dumbledore') 
    {

        msg.reply(`Hi Im Dumbledore ${Community_Tag} Bot`);

    }

    if (msg.content === '?ip') 
    {

        msg.reply(`Server IP: ${Samp_IP}`);
 
    }  
    //------------------------------[Medthod 2]-------------------------------------------
    if (msg.content.charAt(0) === botChar) {
		const request = msg.content.substr(1);
		let command, parameters = [];

		if (request.indexOf(" ") !== -1) {
			command = request.substr(0, request.indexOf(" "));
			parameters = request.split(" ");
			parameters.shift();
		} else {
			command = request;
		}

		switch (command.toLowerCase()) {
			case "verif":
				sendUserApplyForm(msg, parameters.join(" "));
				break;
			case "cmlv":
				GetPlayersOnline(msg);
				break;
			case "joueurs":
				GetPlayersInGame(msg);
				break;				
			case "annuler":
				cancelUserApplicationForm(msg);
				break;
			case "restart":
				cancelUserApplicationForm(msg, true);
				sendUserApplyForm(msg);
				break;
			case "setup":
				applicationFormSetup(msg);
				break;
			case "endsetup":
				endApplicationFormSetup(msg);
				break;
			case "setchannel":
				setChannel(msg, parameters.join(" "));
				break;
			case "help":
				helpinfo(msg);
				break;
			case "sban":
				sBAN(msg, parameters.join(" "));
				break; 
			case "unban":
				uBAN(msg, parameters.join(" "));
				break; 
			case "clear":
					Clear_Messages(msg, parameters.join(" "));
					break;
			case "setip":
					setSampIP(msg, parameters.join(" "))
					break;
			case "setport":
					setSampPort(msg, parameters.join(" "))
					break;		 	
            case "ip":
					break;
			case "debug":
					toggle_debug()
					break;				
            case "players":
					break;	
			default:
				
		}
	} else {
		if (msg.channel.type === "dm") {
			if (msg.author.id === isSettingFormUp) {
				appNewForm.push(msg.content);
			} else {
				const user = usersApplicationStatus.find(user => user.id === msg.author.id);

				if (user && msg.content) {
					user.answers.push(msg.content);
					user.currentStep++;

					if (user.currentStep >= applicationQuestions.length) {
						applicationFormCompleted(user);
						msg.author.send("Félicitations, votre vérification vient d'être remise au staff de CeMondeLeVotre.\nVous recevrez vos droits (permissions d'accès aux salons) sous peu ! À bientôt.");
					} else {
						msg.author.send(applicationQuestions[user.currentStep]);
					}
				}
			}
		}
	}  

});
//_____________________________________[END-SAMP CMDS]____________________________________________________________________
 

//====================== BOT TOKEN FROM ENV VAIABLE ===================================

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret

//=====================================================================================
