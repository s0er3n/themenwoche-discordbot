const Discord = require("discord.js");
const client = new Discord.Client()
const fs = require('fs');
const readline = require('readline');

let themenpoll = "Im moment gibt es keine Abstimmung"


client.on("ready", () => {
  console.log("Connected as " + client.user.tag);

})
client.on("message", msg => {
  if (msg.content.toLowerCase().startsWith("neues thema")) {
    let thema = msg.content.slice(12);
    fs.appendFileSync('themen.txt', "\n" + thema);
    { msg.reply("Du hast das Thema " + thema + " hinzugefügt. Bei der nächsten Themenwoche kannst du dafür abstimmen!"); }
  }
  if (msg.content.toLowerCase() === "themen") {
    let themen = fs.readFileSync("themen.txt", "utf-8").split("\n");
    msg.reply("\n" + themen.join("\n"))
  }
  if (msg.content.toLowerCase() === "mache umfrage" || msg.content.toLowerCase() === "neue umfrage") {
    let themen = fs.readFileSync("themen.txt", "utf-8").split("\n");

    var poll = { title: 'Themenwoche', options: themen };

    var request = require('request');

    request.post({
      url: 'https://www.strawpoll.me/api/v2/polls',
      followAllRedirects: true, // <----
      body: poll,
      json: true,
      "Content-Type": "application/json"
    },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
          msg.reply("https://www.strawpoll.me/"+body["id"])
          themenpoll = "https://www.strawpoll.me/"+body["id"]
        }
      }
    );
  }
  if (msg.content.toLowerCase() === "umfrage") {
    msg.reply(themenpoll);
  }
})

client.login(process.env.token)