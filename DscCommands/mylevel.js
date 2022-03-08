const config = require("../config.js");
exports.run = async (client, message, args, level) => {
  const friendly = config.permLevels.find(l => l.level === level).name;
  message.reply({ content: `Your permission level is: ${level} - ${friendly}`, allowedMentions: { repliedUser: true }});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mylevel",
  category: "Miscellaneous",
  description: "Tells you your permission level for the current message location.",
  usage: "mylevel"
};
