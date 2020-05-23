//Import all libraries or dependecies
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
var vars = require("./vars.json");
bot.commands = new Discord.Collection();

bot.on("ready", async () => {
  console.log(`\n${bot.user.username} is online!`);
  bot.user.setActivity("-help", {type: "PLAYING"});
})

bot.on("message", async message => {

if(message.author.bot) return;
if(message.channel.type === "dm") return;

let role = message.author.role;
let user = message.author;

/*Help Command*/
if(message.content.toLowerCase().startsWith("-help")){
  message.delete();
  message.channel.send(`You've got mail! ${user}`);
  var embed = new Discord.MessageEmbed()
  .setColor('#1C1B1B')
  .setTitle(':ballot_box: MUN Bot Help!')
  .setDescription("MUN Bot Command Help")
  .addField("Commands", "`-voters` : Used to set number of voters\n`-poll  ` : Used to create a poll session" + 
    "\n`-vote  ` : Used to vote when a poll is active\n`-end   ` : Used to end an active poll session")
  .setFooter('MUN Bot | Made by Jaymz#7815')
  message.author.send(embed);
}

/*Voters Commands*/
//Checks if there is an integer after the command.
if (message.content.toLowerCase().startsWith("-voters") && vars.pollactive == false){
    message.delete();
    var arr = message.content.split(" ");
      vars.delegates = arr[1];
    if(arr[1] == null){
    message.channel.send(":warning: Please insert a valid number!")
    return;
  }
  //Sets the number of delegates/voters accordingly if an integer is provided.
    else if (arr[1] > 0){
  vars.delegates = arr[1];
  console.log("Number of delegates set to " + vars.delegates + ".");
  message.channel.send("Number of delegates set to " + vars.delegates + "."); 
    }
}

//Guarantees that the number of voters cannot be changed during a poll.
else if (message.content.toLowerCase().startsWith("-voters") && vars.pollactive == true){
	message.delete();
	message.channel.send(":warning: A poll is currently active! Use `-end` to end the poll now!")
}

/*Poll Command*/
//Outputs a warning/error to include a statement/argument after the command.

if (message.content.toLowerCase() == ("-poll") && vars.pollactive == false && vars.delegates != 0){
  message.delete(); 
  message.channel.send(":warning: Please include a statement after `-poll` command");
}

//Runs a poll only if there is no poll active and there is an argument after the command.
else if(message.content.toLowerCase().startsWith("-poll") && vars.pollactive == false && vars.delegates != 0){
  message.delete(); 
  message.channel.send(`:ballot_box: ${user} started a vote! Reply with **-vote yes** / **-vote no** / **-vote abstain**. :ballot_box:` +
   `\n` + `> ${message.content.toString().slice(6)}`);
  vars.pollactive = true;
}

//Checks if the number of voters is already set prior to the poll command being issued.
else if (message.content.toLowerCase().startsWith("-poll") && vars.pollactive == false && vars.delegates == 0){
	message.delete(); 
	message.channel.send(":x: Please set number of voters with `-voters n`")
}

//Checks if a poll is currently active before starting a new poll.
else if (message.content.toLowerCase().startsWith("-poll") && vars.pollactive == true){
	message.delete(); 
	message.channel.send(":warning: A poll is currently active! Use `-end` to end the poll now!")
}

/*Vote command*/
var voted = vars.voted;
if(message.content.toLowerCase().startsWith("-vote") && vars.pollactive == true && vars.votednum < vars.delegates && !voted.includes(message.author)){
  var arrvote = message.content.split(" ");

  //If delegate performed the command "-vote yes", it will move delegate's discord username into the "voted" list/array.
  if(arrvote[1].toLowerCase() == "yes"){
    voted.push(message.author);
    message.delete();
    //Doing so will add 1 to the "Yes" count and total vote count which will be revealed at the end of voting.
    vars.yes++;
    vars.votednum++;
    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted yes.
    message.channel.send(`:ballot_box: ${user} has voted **Yes**.`);
    return;
    }

  //If delegate performed the command "-vote no", it will move delegate's discord username into the "voted" list/array.
  if(arrvote[1].toLowerCase() == "no"){
    voted.push(message.author);
    message.delete();
    //Doing so will add 1 to the "No" count and total vote count which will be revealed at the end of voting.
    vars.no++;
    vars.votednum = vars.votednum+1 ;
    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
    message.channel.send(`:ballot_box: ${user} has voted **No**.`);
    return;
    }

  //If delegate performed the command "-vote abstain", it will move delegate's discord username into the "voted" list/array.
  if(arrvote[1].toLowerCase() == "abstain"){
    voted.push(message.author);
    message.delete();
    //Doing so will add 1 to the "Abstain" count and total vote count which will be revealed at the end of voting.
    vars.abstain++;
    vars.votednum++;
      //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
      message.channel.send(`:ballot_box: ${user} has **abstained** from voting.`);
    return;
}}

else if (message.content.toLowerCase().startsWith("-vote") && vars.pollactive == true && vars.votednum <= vars.delegates && voted.includes(message.author)){
	message.delete();
	message.channel.send(`:x: ${user} You have already voted once`);
}

/*End poll command*/
//Ends poll accordingly if the conditions are met.
if (message.content.toLowerCase().startsWith("-end") && vars.pollactive == true && vars.votednum == vars.delegates){
	vars.pollactive = false;
	message.delete();
	message.channel.send(":ballot_box: Poll has ended!" + "\n" + "Number of delegates who voted **Yes**: " + vars.yes +
   "\n" + "Number of delegates who voted **No**: " + vars.no + "\n" + "Number of delegates who **abstained** from voting: " + vars.abstain);
	vars.yes = 0;
	vars.no = 0;	
	vars.abstain = 0;
	vars.delegates = 0;
	vars.votednum = 0;
	vars.voted = [];
}

//Checks if a poll is active before being able to end. (Logic)
else if (message.content.toLowerCase().startsWith("-end") && vars.pollactive == false){
	vars.pollactive = false;
	message.delete();
	message.channel.send(`:x: ${user} There is no active poll currently`);
}

//Checks if everyone has voted before allowing the user to end the poll.
else if (message.content.toLowerCase().startsWith("-end") && vars.pollactive == true && vars.votednum < vars.delegates ){
	message.delete();
	message.channel.send(`:x: Make sure everyone has voted before ending the poll.`);
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

bot.login(process.env.BOT_TOKEN);
