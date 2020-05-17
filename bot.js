//Import all libraries or dependecies
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

bot.on("ready", async () => {
	console.log(`\n${bot.user.username} is online!`);
	bot.user.setActivity("-help", {type: "PLAYING"});
})

bot.on("message", async message => {

if(message.author.bot) return;
if(message.channel.type === "dm") return;
let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

//Import all libraries or dependecies
const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

bot.on("ready", async () => {
	console.log(`\n${bot.user.username} is online!`);
	bot.user.setActivity("-help", {type: "PLAYING"});
})

bot.on("message", async message => {

if(message.author.bot) return;
if(message.channel.type === "dm") return;
let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

//For easy access
let role = message.author.role;
let user = message.author;

//Variables needed for voting commands to work
var voted= [];
const delegates = 2;
var yesCount = 0;
var noCount = 0;
var abstainCount = 0;
var votednum = 0;

//Command can only be executed by members with role "Delegate"
if (message.member.roles.some(role => role.name === 'Delegate')) {
if (user.bot) return; 

//A do while loop will make sure everyone has voted in order for the voting to end. 
while (votednum < delegates){
/* Checks if the delegates have voted or not. 
   Their vote will only be counted if they have not been included in the "voted" list/array. 
*/
	if(user != voted) {
		//If delegate performed the command "-vote yes", it will move delegate's discord username into the "voted" list/array.
 		if(message.content.toLowerCase() == "-vote yes"){
 			message.delete();
 			voted.push(user);
			//Doing so will add 1 to the "Yes" count and total vote count which will be revealed at the end of voting.
 			yesCount++;
 			votednum++;
 			//As well as to inform everyone, a message will popup in the chat saying that the delegate has voted yes.
 			message.channel.send(`:ballot_box: ${user} has voted **Yes**.`);
		}
		//If delegate performed the command "-vote no", it will move delegate's discord username into the "voted" list/array.
 		if(message.content.toLowerCase() == "-vote no"){
 			message.delete();
 			voted.push(user);
 			//Doing so will add 1 to the "No" count and total vote count which will be revealed at the end of voting.
 			noCount++;
 			votednum++;
 			//As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
  			message.channel.send(`:ballot_box: ${user} has voted **No**.`);
		}
		//If delegate performed the command "-vote abstain", it will move delegate's discord username into the "voted" list/array.
 		if(message.content.toLowerCase() == "-vote abstain"){
 		message.delete();
 		voted.push(user);
 		//Doing so will add 1 to the "Abstain" count and total vote count which will be revealed at the end of voting.
 		abstainCount++;
 		votednum++;
 	    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
  		message.channel.send(`:ballot_box: ${user} has **abstained** from voting.`);
		}
	}else {
/* If the delegate has already voted, despite of which argument he inputs after "-vote`, it will NOT be counted.
*/
 		if(args[0].toLowerCase() == "yes" || args[0].toLowerCase() == "no" || args[0].toLowerCase() == "abstain"){
		message.channel.send(`${user} You already voted!`);
		message.delete();
		}
	}
}
}
	console.log(voted);

/* To ensure everyone has voted, this whole code block will loop until everyone has voted. */
    if (votednum == delegates) {
        message.channel.send(yesCount + ` delegate(s) have voted **Yes**.` + `\n` + noCount + ` delegate(s) have voted **No**.` + `\n` + abstainCount + ` delegate(s) have **abstained** from voting.`)
    }

if(!prefixes[message.guild.id]){
   	prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

let prefix = prefixes[message.guild.id].prefixes;
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);
let commandfile = bot.commands.get(cmd.slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);

})

bot.login(tokenfile.token);

if(!prefixes[message.guild.id]){
   	prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

let prefix = prefixes[message.guild.id].prefixes;
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);
let commandfile = bot.commands.get(cmd.slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);

})

bot.login(process.env.BOT_TOKEN);
