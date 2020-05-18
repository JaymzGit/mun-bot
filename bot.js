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
var pollactive;

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
var pollactive = true;
if(message.content.toLowerCase().startsWith("-poll") && pollactive == false){
  message.delete();
  message.channel.send(`:ballot_box: ${user} started a vote! Reply with **-vote yes** / **-vote no** / **-vote abstain**. :ballot_box:` + `\n` + `> ${message.content.toString().slice(6)}`);
  pollactive = true;
}

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
