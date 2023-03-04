const AutoReddit = require("./AutoReddit");

const bot = new AutoReddit({
  userAgent: "myUserAgent",
  clientId: "myClientId",
  clientSecret: "myClientSecret",
  username: "myUsername",
  password: "myPassword",
  subredditsFilePath: "./subreddits.json",
  interval: 10000, // 10 seconds
});

bot.start();

// Add Subreddit
// bot.modifySubreddits("add", {
//   webhookUrl: "WEBHOOK_URL_3",
//   subreddit: "SUBREDDIT_3",
// });

// Edit Subreddit
// bot.modifySubreddits("edit", {
//   webhookUrl: "NEW_WEBHOOK_URL",
//   subreddit: "SUBREDDIT_2",
// });

// Remove Subreddit
// bot.modifySubreddits("remove", {
//   subreddit: "SUBREDDIT_1",
// });
