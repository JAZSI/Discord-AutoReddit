# Discord AutoReddit

This is a Node.js class called `AutoReddit`, which is designed to help automate posting content from various subreddits to Discord using webhooks. It uses the Snoowrap library to access Reddit's API and fetches new content from subreddits.

## Prerequisites
- Node.js installed on your computer.
- Basic understanding of JavaScript programming language.

## Installation
1. Download or clone the `AutoReddit` class file to your local computer.
2. Install the required dependencies by running npm install snoowrap in your terminal.
Usage
Here is a basic example on how to use the `AutoReddit` class:
```js
const AutoReddit = require('./AutoReddit');

const autoReddit = new AutoReddit({
  userAgent: 'myUserAgent',
  clientId: 'myClientId',
  clientSecret: 'myClientSecret',
  username: 'myUsername',
  password: 'myPassword',
  subredditsFilePath: './subreddits.json',
  interval: 10000, // 10 seconds
});

autoReddit.start();
```
or
```js
const AutoReddit = require("./AutoReddit (fetch only no snoowrap)");

const bot = new AutoReddit({
  subredditsFilePath: "./subreddits.json",
  interval: 10000, // 10 seconds,
  limit: 100
});

bot.start();
```
This example creates a new instance of the `AutoReddit` class, passing in the required parameters for authentication to Reddit's API, the path to the file where the subreddits are stored, and the interval at which new content is fetched from Reddit. It then calls the `start` method to begin fetching new content and posting it to Discord.

## Methods
The `AutoReddit` class provides the following methods:

`start()`: Starts fetching new content from the specified subreddits and posting them to Discord.
`stop()`: Stops fetching new content and posting it to Discord.
`restart()`: Restarts the fetching and posting process.
`modifySubreddits(action, subredditData)`: Modifies the list of subreddits being monitored. The `action` parameter can be one of `"add"`, `"edit"`, or `"remove"`. The `subredditData` parameter is an object containing information about the subreddit being added, edited, or removed.

## Configuring Subreddits
Subreddits can be added, edited, or removed from the list by calling the `modifySubreddits` method. The subreddits are stored in a JSON file specified by the `subredditsFilePath` parameter. Here is an example of the file structure:
```json
[
  {
    "subreddit": "funny",
    "webhookUrl": "https://discord.com/api/webhooks/123456789012345678/abcde12345"
  },
  {
    "subreddit": "gifs",
    "webhookUrl": "https://discord.com/api/webhooks/123456789012345678/abcde12345"
  }
]
```
Each object in the array represents a subreddit and its associated webhook URL. To add a new subreddit, simply create a new object with the `"subreddit"` and `"webhookUrl"` properties and call the `modifySubreddits` method with the `"add"` action and the new object as the `subredditData` parameter.

## Credits
This project was created by Jaszi.

## License
This project is licensed under the MIT License.
