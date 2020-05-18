//Import all libraries or dependecies
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

//Check for any files in the commands folders (aka checking if the bot has the following commands or not)
fs.readdir("./commands/", (err, files) => {

//If there's a command file that ends with .js then proceed as normal otherwise, console will say "Couldn't find commands."
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find command files.");
    return;
    throw err;
  }

//To get output in console 
//>...[1:20:56 AM INFO]: [discord.js] - JS:tag.js
  jsfile.forEach((f, i) =>{
    var d = new Date().toLocaleTimeString();
    let props = require(`./commands/${f}`);
//Displays all files that are found in the commands folder
    console.log(`>...[${d} INFO]: [discord.js] - JS:${f}`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
	console.log(`\n${bot.user.username} is online!`);
	bot.user.setActivity("-help", {type: "PLAYING"});
})

bot.on("message", async message => {

if(message.author.bot) return;
if(message.channel.type === "dm") return;

let role = message.author.role;
let user = message.author;
	
//Commands :
/*Help Command
For those that forgot what the command is*/
if(message.content.toLowerCase().startsWith("-help")){
  message.channel.send(`You've got mail! ${user}`);
  var embed = new Discord.MessageEmbed()
  .setColor('#1C1B1B')
  .setTitle(':ballot_box: MUN Bot Help!')
  .setDescription("MUN Bot Command Help")
  .addField("Commands", "`-poll` : Used to create a poll\n`-vote` : Used to vote when a poll is active")
  .setFooter('MUN Bot | Made by Jaymz#7815')
  message.author.send(embed);
}

/*Vote Command*/
var pollactive = false;
if(message.content.toLowerCase().startsWith("-voters") && pollactive == false){
  message.delete();
  var arr = message.content.split(" ");
  var delegates = arr[1];
  console.log("Number of delegates set to " + delegates + ".");
  message.channel.send("Number of delegates set to " + delegates + ".");
}

/*Poll Command
Poll is not rendered "active" until the poll is active.*/
if(message.content.toLowerCase().startsWith("-poll") && pollactive == false){
  message.delete(); 
  message.channel.send(`:ballot_box: ${user} started a vote! Reply with **-vote yes** / **-vote no** / **-vote abstain**. :ballot_box:` + `\n` + `> ${message.content.toString().slice(6)}`);
  pollactive = true;
}
var yesCount = 0;
var noCount = 0;
var abstainCount = 0;
if(message.content.toLowerCase().startsWith("-vote") && pollactive == true && votednum < delegates && voted.include(message.member.displayName){
	var arrvote = message.content.split(" ");
	if(arrvote[1].toLowerCase() == "yes"){
		voted.push(message.member.displayName);
		message.delete();
		//Doing so will add 1 to the "Yes" count and total vote count which will be revealed at the end of voting.
		yesCount++;
		votednum++;
		//As well as to inform everyone, a message will popup in the chat saying that the delegate has voted yes.
		message.channel.send(`:ballot_box: ${user} has voted **Yes**.`);
		return;
		}
	//If delegate performed the command "-vote no", it will move delegate's discord username into the "voted" list/array.
	if(arrvote[1].toLowerCase() == "no"){
		voted.push(message.member.displayName);
		message.delete();
		//Doing so will add 1 to the "No" count and total vote count which will be revealed at the end of voting.
		noCount++;
		votednum++;
		//As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
		message.channel.send(`:ballot_box: ${user} has voted **No**.`);
		return;
		}
	//If delegate performed the command "-vote abstain", it will move delegate's discord username into the "voted" list/array.
	if(arrvote[1].toLowerCase() == "abstain"){
		voted.push(message.member.displayName);
		message.delete();
		//Doing so will add 1 to the "Abstain" count and total vote count which will be revealed at the end of voting.
		abstainCount++;
		votednum++;
 	    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
  		message.channel.send(`:ballot_box: ${user} has **abstained** from voting.`);
 		return;
}
// else (message.content.toLowerCase().startsWith("-poll") && pollactive == true){
//   message.delete();
//   message.channel.send(`:x: ${user} There is currently an ongoing poll. Make everyone vote to end the poll!`);
// }

let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

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

bot.login(proces.env.BOT_TOKEN);
