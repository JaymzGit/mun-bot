//Import all libraries or dependecies
const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({
  disableEveryone: true
});
var vars = require("./vars.json");
var d = new Date().toLocaleTimeString();
bot.commands = new Discord.Collection();

const express = require('express');
const app = express();
const port = 3300;

app.get('/', (req, res) => res.send('<h1>mun-bot</h1> <hr>Please do not distribute this code or copy it without my permission. <br><br>This bot was orginally designed specifically for Penang Model United Nations 2020 (<b>PMUN 2020</b>) with their website : <a href="https://penangmun20.wixsite.com/pmun2020">https://penangmun20.wixsite.com/pmun2020</a><br><br> It was made during the <b>Covid-19</b> (coronavirus) pandemic to allow <b>PMUN 2020</b> conference to continue virtually through Discord.<br>This bot uses Javascript (JS) with the node module Discord.js<br><br><b>Features</b> :<br>- [x] Able to set the number of voters before each poll session. <br>- [x] Able to change the number of voters if a poll has not been done yet.<br>- [x] Able to start a voting session (poll).<br>- [x] Allow Delegates of Model United Nations (MUN) to vote only ONCE per session*<br>- [x] Able to grant a revote if a Delegate decided to change their vote if they voted rashly.<br>- [x] Allow the discord roles "Admin", "Chair", "Secretariat", and "Secretariat General" to bypass all commands while "Delegate" only has perms to vote.<br>- [x] Able to manually force the poll to end if one or more Delegates did not vote.<br><br>\* Delegates may revote if granted by the Chair</h6><br><br><b>This project was also a colaboration between</b> :<br>1. Jaymz (myself)<br>2. SottaByte<br><br>Requested by Joshua Lee, as the USG of Conference Management for PMUN 2020. <br><br> Copyright © 2020 <a href="github.com/JaymzGit">JaymzGit</a>'));
  
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

bot.on("ready", async () => {
  console.log(`>...[${d} INFO]: [MUN Bot]: ${bot.user.username} Bot is starting!`);
  bot.user.setActivity("-help", {
    type: "PLAYING"
  });
  console.log(`>...[${d} INFO]: [MUN Bot]: ${bot.user.username} Bot started!`);
})

bot.on("message", async message => {

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let role = message.author.role;
  let user = message.author;

  /*Help Command*/
  if (message.content.toLowerCase()
      .startsWith("-help")) {
    if (message.author.bot) return;
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
  let x;
  if (message.content.toLowerCase().startsWith("-voters")) {
    if (message.member.roles.cache.some(role => role.name === 'Chair') || message.member.roles.cache.some(role => role.name === 'Admin') || 
      message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      var arr = message.content.split(" ");
      for (i in vars.channels) {
        if (vars.channels[i].channelID === message.channel.id) {
          message.channel.send(":warning: Voters has already been set! Either create a poll with `-poll` or change the number of voters with `-force voters`!")
          break;
        } else {
          if (vars.channels[i].channelID == "0" && (arr[1] % 1 == 0) &&(arr[1] != 0)) {
            message.delete();
            vars.channels[i].channelID = message.channel.id;
            vars.channels[i].delegates = arr[1];
            console.log(`>...[${d} INFO]: [MUN Bot]: Number of delegates set to `  + vars.channels[i].delegates + " in channel ID: " + "'" + vars.channels[i].channelID + "'");
            message.channel.send("Number of delegates set to " + vars.channels[i].delegates + ".");

            break;

          } else if (vars.channels[i].channelID == "0" && arr[1] == null) {
            message.channel.send(":warning: Please insert a number!");
            break;

            //Sets the number of delegates/voters accordingly if an integer is provided.

          } else if (vars.channels[i].channelID == "0" && Number.isInteger(arr[1]) == false) {
            message.channel.send(":warning: Please insert a valid number!")
            break;
          }
        }
      }
      //return;
    } else {
      message.delete();
      message.channel.send(":x: You do not have permission to set voters " + `${user}`)
      return;
    }
  }
  /*Poll Command*/
  //Outputs a warning/error to include a statement/argument after the command.
  if (message.content.toLowerCase().startsWith("-poll")) {
    if (message.member.roles.cache.some(role => role.name === 'Chair') || message.member.roles.cache.some(role => role.name === 'Admin') || 
      message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (x in vars.channels) {
        //Runs a poll only if there is no poll active and there is an argument after the command.
        if ((vars.channels[x].channelID == message.channel.id) && (vars.channels[x].pollactive == false) && (vars.channels[x].delegates != 0)) {
          message.delete();
          message.channel.send(`:ballot_box: ${user} started a vote! Reply with **-vote yes** / **-vote no** / **-vote abstain**. :ballot_box:` +
              `\n` + `> ${message.content.toString().slice(6)}`);
          vars.channels[x].pollactive = true
          console.log(`>...[${d} INFO]: [MUN Bot]: A poll was succesfully created.`)
          break;
        }

        //Checks if the number of voters is already set prior to the poll command being issued.
        else if ((vars.channels[x].channelID == message.channel.id && vars.channels[x].delegates == 0) || vars.channels[x].channelID == 0) {
          message.delete();
          message.channel.send(":x: Please set number of voters with `-voters n`")
          break;
        }


        //Checks if a poll is currently active before starting a new poll.
        else if ((vars.channels[x].channelID == message.channel.id && vars.channels[x].pollactive == true)) {
          message.delete();
          message.channel.send(":warning: A poll is currently active! Use `-force end` to end the poll!")
          break;
        }
      }
    } else if (!message.member.roles.cache.some(role => role.name === 'Chair') || !message.member.roles.cache.some(role => role.name === 'Admin') || 
      !message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      !message.member.roles.cache.some(role => role.name === 'Secretary General')) {

      message.delete();
      message.channel.send(":x: You do not have permission to start a poll " + `${user}`);
      return;
    }
  }

  if (message.content.toLowerCase() == "-yes" || message.content.toLowerCase() == "-vote yes") {
    if (message.member.roles.cache.some(role => role.name === 'UNHCR Delegates') || message.member.roles.cache.some(role => role.name === 'WMO Delegates') ||
        message.member.roles.cache.some(role => role.name === 'HUNGA Delegates') || message.member.roles.cache.some(role => role.name === 'WTO Delegates') ||
        message.member.roles.cache.some(role => role.name === 'Admin') || message.member.roles.cache.some(role => role.name === 'Secretariat') ||  
        message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (y in vars.channels) {
        //Runs a poll only if there is no poll active and there is an argument after the command.
        if ((vars.channels[y].channelID == message.channel.id) && (vars.channels[y].pollactive == true && vars.channels[y].votednum < vars.channels[y].delegates && !vars.channels[y].voted.includes(message.author.id))) {
          //If delegate performed the command "-yes", it will move delegate's discord username into the "voted" list/array.
          vars.channels[y].voted.push(message.author.id);
          vars.channels[y].votedoptions.push("yes");
          message.delete();
          //Doing so will add 1 to the "Yes" count and total vote count which will be revealed at the end of voting.
          vars.channels[y].yes++;
          vars.channels[y].votednum++;
          //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted yes.
          message.channel.send(`:ballot_box: ${user} has voted **Yes**. ` + `[` + vars.channels[y].votednum + "/" + vars.channels[y].delegates + `]`);
          y = 0;
          break;
        } else if ((message.content.toLowerCase() == "-yes" || message.content.toLowerCase() == "-vote yes") && vars.channels[y].pollactive == true &&
            vars.channels[y].votednum <= vars.channels[y].delegates && vars.channels[y].voted.includes(message.author.id)) {
          message.delete();
          message.channel.send(`:x: ${user} You have already voted once!`);
          return;
        }
      }
    }
  }

  if (message.content.toLowerCase() == "-no" || message.content.toLowerCase() == "-vote no") {
    if (message.member.roles.cache.some(role => role.name === 'UNHCR Delegates') || message.member.roles.cache.some(role => role.name === 'WMO Delegates') ||
        message.member.roles.cache.some(role => role.name === 'HUNGA Delegates') || message.member.roles.cache.some(role => role.name === 'WTO Delegates') ||
        message.member.roles.cache.some(role => role.name === 'Admin') || message.member.roles.cache.some(role => role.name === 'Secretariat') ||  
        message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (n in vars.channels) {
        //Runs a poll only if there is no poll active and there is an argument after the command.
        if ((vars.channels[n].channelID == message.channel.id) && (vars.channels[n].pollactive == true && vars.channels[n].votednum < vars.channels[n].delegates && !vars.channels[n].voted.includes(message.author.id))) {
          //If delegate performed the command "-no", it will move delegate's discord username into the "voted" list/array.
          vars.channels[n].voted.push(message.author.id);
          vars.channels[n].votedoptions.push("no");
          message.delete();
          //Doing so will add 1 to the "no" count and total vote count which will be revealed at the end of voting.
          vars.channels[n].no++;
          vars.channels[n].votednum++;
          //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
          message.channel.send(`:ballot_box: ${user} has voted **No**. ` + `[` + vars.channels[n].votednum + "/" + vars.channels[n].delegates + `]`);
          n = 0;
          break;
    } else if ((message.content.toLowerCase() == "-no" || message.content.toLowerCase() == "-vote no") && vars.channels[n].pollactive == true &&
        vars.channels[n].votednum <= vars.channels[n].delegates && vars.channels[n].voted.includes(message.author.id)) {
          message.delete();
          message.channel.send(`:x: ${user} You have already voted once!`);
          return;
        }
      }
    }
  }


  if (message.content.toLowerCase() == "-abstain" || message.content.toLowerCase() == "-vote abstain") {
    if (message.member.roles.cache.some(role => role.name === 'UNHCR Delegates') || message.member.roles.cache.some(role => role.name === 'WMO Delegates') ||
        message.member.roles.cache.some(role => role.name === 'HUNGA Delegates') || message.member.roles.cache.some(role => role.name === 'WTO Delegates') ||
        message.member.roles.cache.some(role => role.name === 'Admin') || message.member.roles.cache.some(role => role.name === 'Secretariat') ||  
        message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (a in vars.channels) {
        //Runs a poll only if there is no poll active and there is an argument after the command.
        if ((vars.channels[a].channelID == message.channel.id) && (vars.channels[a].pollactive == true && vars.channels[a].votednum < vars.channels[a].delegates && !vars.channels[a].voted.includes(message.author.id))) {
          //If delegate performed the command "-abstain", it will move delegate's discord username into the "voted" list/array.
          vars.channels[a].voted.push(message.author.id);
          vars.channels[a].votedoptions.push("abstain");
          message.delete();
          //Doing so will add 1 to the "abstain" count and total vote count which will be revealed at the end of voting.
          vars.channels[a].abstain++;
          vars.channels[a].votednum++;
          //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted abstain.
          message.channel.send(`:ballot_box: ${user} has **abstained** from voting. ` + `[` + vars.channels[a].votednum + "/" + vars.channels[a].delegates + `]`);
          a = 0;
          break;
        } else if ((message.content.toLowerCase() == "-abstain" || message.content.toLowerCase() == "-vote abstain") && vars.channels[a].pollactive == true &&
            vars.channels[a].votednum <= vars.channels[a].delegates && vars.channels[a].voted.includes(message.author.id)) {
          message.delete();
          message.channel.send(`:x: ${user} You have already voted once!`);
          return;
        }
      }
    }
  }


  for (let e in vars.channels) {
    if ((vars.channels[e].channelID == message.channel.id) && vars.channels[e].pollactive == true && vars.channels[e].votednum == vars.channels[e].delegates) {
      vars.channels[e].pollactive = false;
      message.channel.send(":ballot_box: Poll has ended!" + "\n" +
          "Number of delegates who voted Yes: " + vars.channels[e].yes + "\n" +
          "Number of delegates who voted No: " + vars.channels[e].no + "\n" +
          "Number of delegates who abstained from voting: " + vars.channels[e].abstain);
      vars.channels[e].channelID =0;
      vars.channels[e].yes = 0;
      vars.channels[e].no = 0;
      vars.channels[e].abstain = 0;
      vars.channels[e].delegates = 0;
      vars.channels[e].votednum = 0;
      vars.channels[e].voted = [];
      break;
    }
  }

  /*Allow revote command*/
  if (message.content.toLowerCase().startsWith("-allow")){
    if (message.member.roles.cache.some(role => role.name === 'Chair') || message.member.roles.cache.some(role => role.name === 'Admin') || 
      message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (let i in vars.channels) {
        if ((vars.channels[i].channelID == message.channel.id) && vars.channels[i].pollactive == true) {
          const pinged = message.mentions.users.first();
          if (vars.channels[i].voted.includes(pinged.id)) {
            message.channel.send(`:ballot_box: ${pinged} has been granted a revote.`);
            vars.channels[i].votednum--;
            const index = vars.channels[i].voted.indexOf(pinged.id)
            i = 0;
            if (index > -1) {
              vars.channels[i].voted.splice(index, 1);
              if (vars.channels[i].votedoptions[index] == "yes") {
                vars.channels[i].yes--;
                break;
              } else if (vars.channels[i].votedoptions[index] == "no") {
                vars.channels[i].no--;
                break;
              } else if (vars.channels[i].votedoptions[index] == "abstain") {
                vars.channels[i].abstain--;
                break;
              }
            }
          } else if (!vars.channels[i].voted.includes(pinged.id)) {
            message.channel.send(`:x: ${pinged} has not voted yet!`)
            break;
          }
        } else if (vars.channels[i].pollactive == false) {
          message.delete();
          message.channel.send(`:warning: There is no poll active currently.`);
          break;
        }
      }
    } else if (!message.member.roles.cache.some(role => role.name === 'Chair') || !message.member.roles.cache.some(role => role.name === 'Admin') || 
      !message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      !message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      message.delete();
      message.channel.send(":x: You do not have permission to do grant a revote " + `${user}`)
      return;
    }
  }
  
  /*End poll command*/
  //Ends poll accordingly if the conditions are met.
  if (message.content.toLowerCase().startsWith("-end")) {
    if (message.member.roles.cache.some(role => role.name === 'Chair') || message.member.roles.cache.some(role => role.name === 'Admin') ||
        message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (let i in vars.channels) {
        if ((vars.channels[i].channelID == message.channel.id) && vars.channels[i].pollactive == true && vars.channels[i].votednum == vars.channels[i].delegates) {
          vars.channels[i].pollactive = false;
          message.delete();
          message.channel.send(":ballot_box: Poll has ended!" + "\n" +
              "Number of delegates who voted **Yes**: " + vars.channels[i].yes + "\n" +
              "Number of delegates who voted **No**: " + vars.channels[i].no + "\n" +
              "Number of delegates who **abstained** from voting: " + vars.channels[i].abstain);
          vars.channels[i].channelID =0;
          vars.channels[i].yes = 0;
          vars.channels[i].no = 0;
          vars.channels[i].abstain = 0;
          vars.channels[i].delegates = 0;
          vars.channels[i].votednum = 0;
          vars.channels[i].voted = [];
          i = 0;
          break;
        }
      }
    } else if (!message.member.roles.cache.some(role => role.name === 'Chair') || !message.member.roles.cache.some(role => role.name === 'Admin') || 
      !message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      !message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      message.channel.send(":x: You do not have permission to end a poll " + `${user}`)
      return;
    }
  }

  /*Force end command*/
  if (message.content.toLowerCase().startsWith("-force end")){
    if (message.member.roles.cache.some(role => role.name === 'Chair') || message.member.roles.cache.some(role => role.name === 'Admin') || 
      message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      for (let i in vars.channels) {
        if ((vars.channels[i].channelID == message.channel.id) && vars.channels[i].pollactive == true) {
          vars.channels[i].pollactive = false;
          var remaining = vars.channels[i].delegates - vars.channels[i].votednum;
          message.delete();
          message.channel.send(":ballot_box: Poll has ended!" + "\n" +
              "Number of delegates who voted **Yes**: " + vars.channels[i].yes + "\n" +
              "Number of delegates who voted **No**: " + vars.channels[i].no + "\n" +
              "Number of delegates who **abstained** from voting: " + vars.channels[i].abstain + "\n" +
              "Number of delegates who didn't vote : " + remaining);
          vars.channels[i].channelID =0;
          vars.channels[i].yes = 0;
          vars.channels[i].no = 0;
          vars.channels[i].abstain = 0;
          vars.channels[i].delegates = 0;
          vars.channels[i].votednum = 0;
          vars.channels[i].voted = [];
          i = 0;
          break;
        }
      }
    } else if (!message.member.roles.cache.some(role => role.name === 'Chair') || !message.member.roles.cache.some(role => role.name === 'Admin') || 
      !message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      !message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      message.channel.send(":x: You do not have permission to force end a poll " + `${user}`)
      return;
    }
  }

  if (message.content.toLowerCase().startsWith("-force voters")){
    if (message.member.roles.cache.some(role => role.name === 'Chair') || message.member.roles.cache.some(role => role.name === 'Admin') || 
      message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      var arr = message.content.split(" ");
      for (let o in vars.channels) {
        if ((vars.channels[o].channelID == message.channel.id)) {
          if ((arr[2] % 1 == 0) && (arr[2] != 0)) {
            message.delete();
            vars.channels[o].channelID = message.channel.id;
            vars.channels[o].delegates = arr[2];
            console.log(`>...[${d} INFO]: [MUN Bot]: Number of delegates changed to ` + vars.channels[o].delegates + " in channel ID: " + "'" + vars.channels[o].channelID + "'");
            message.channel.send("Number of delegates changed to " + vars.channels[o].delegates + ".");
            i = 0;
            break;
          }
        }
      }
    } else if (!message.member.roles.cache.some(role => role.name === 'Chair') || !message.member.roles.cache.some(role => role.name === 'Admin') || 
      !message.member.roles.cache.some(role => role.name === 'Secretariat') || 
      !message.member.roles.cache.some(role => role.name === 'Secretary General')) {
      message.channel.send(":x: You do not have permission to change the number of voters " + `${user}`)
      return;
    }
  }

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  let prefix = prefixes[message.guild.id].prefixes;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(bot, message, args);
})
bot.login(tokenfile.token);
