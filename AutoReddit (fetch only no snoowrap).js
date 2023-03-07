const fetch = require("node-fetch");
const fs = require("fs");

class AutoReddit {
  constructor({ subredditsFilePath, interval = 10000 }) {
    this.intervalId = null;
    this.subredditsFilePath = subredditsFilePath;
    this.interval = interval;
    this.limit = limit;
  }

  async start() {
    console.log("[ AUTOREDDIT ] : Autoreddit has started");
    if (!this.intervalId) {
      const subreddits = await this._load();

      this.intervalId = setInterval(async () => {
        for (const subredditData of subreddits) {
          try {
            const res = await this._reddit(subredditData.subreddit, true);
            const post = res.data;
            console.log(post);
            if (post && post.url) {
              const isImage = post.url.match(/\.(jpeg|jpg|gif|png)$/i);
              const isVideo = post.url.match(/\.(mp4|mov|avi|wmv|flv)$/i);

              const embed = {
                title: `/r/${subredditData.subreddit}`,
                description: post.selftext,
                url: `https://www.reddit.com${post.permalink}`,
                color: 0xff6314,
                timestamp: new Date(),
              };

              const payload = {
                username: `/r/${subredditData.subreddit}`,
                content: "",
                embeds: [],
              };

              if (isImage) {
                embed.image = { url: post.url };
              } else if (isVideo) {
                payload.content += `${post.url}`;
              } else {
                embed.fields = [{ name: "Link", value: post.url }];
              }

              payload.embeds.push(embed);

              try {
                await fetch(subredditData.webhookUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                });
              } catch (error) {
                console.log(
                  `Failed to send webhook for subreddit ${subredditData.subreddit}. Error: ${error}`
                );
              }
            } else {
              console.log(`No posts found in /r/${subredditData.subreddit}`);
            }
          } catch (error) {
            console.log(
              `Failed to retrieve posts for subreddit ${subredditData.subreddit}. Error: ${error}`
            );
          }
        }
      }, this.interval);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async restart() {
    if (this.intervalId) {
      this.stop();
      await this.start();
    }
  }

  async modifySubreddits(action, subredditData) {
    const subreddits = await this._load();

    switch (action) {
      case "add":
        if (subreddits.some((s) => s.subreddit === subredditData.subreddit)) {
          throw new Error(
            `Subreddit ${subredditData.subreddit} already exists`
          );
        }
        if (!this._webhookUrl(subredditData.webhookUrl)) {
          throw new Error("Invalid Webhook URL");
        }
        subreddits.push(subredditData);
        break;

      case "edit":
        const index = subreddits.findIndex(
          (s) => s.subreddit === subredditData.subreddit
        );
        if (index === -1) {
          throw new Error(`Subreddit ${subredditData.subreddit} not found`);
        }
        subreddits[index] = {
          ...subreddits[index],
          ...subredditData,
        };
        break;

      case "remove":
        const removeIndex = subreddits.findIndex(
          (s) => s.subreddit === subredditData.subreddit
        );
        if (removeIndex === -1) {
          throw new Error(`Subreddit ${subredditData.subreddit} not found`);
        }
        subreddits.splice(removeIndex, 1);
        break;

      default:
        throw new Error(`Invalid action: ${action}`);
    }

    await this._save(subreddits);
    await this.restart();
  }

  async _load() {
    try {
      const data = await fs.promises.readFile(this.subredditsFilePath);
      return JSON.parse(data.toString());
    } catch (error) {
      console.error(`Failed to load subreddits from file: ${error}`);
      return [];
    }
  }

  async _save(subreddits) {
    try {
      await fs.promises.writeFile(
        this.subredditsFilePath,
        JSON.stringify(subreddits, null, 2)
      );
    } catch (error) {
      console.error(`Failed to save subreddits to file: ${error}`);
    }
  }

  _webhookUrl(url) {
    const pattern = /https:\/\/discord\.com\/api\/webhooks\/\d+\/\w+/;
    return pattern.test(url);
  }

  async _reddit(subreddit, random = false) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      const posts = json.data.children;
      if (posts.length === 0) {
        throw new Error(`No posts found in subreddit ${subreddit}`);
      }
      if (random) {
        return posts[Math.floor(Math.random() * posts.length)];
      }
      return posts;
    } catch (error) {
      if (response.status === 404) {
        throw new Error(`Subreddit ${subreddit} does not exist`);
      } else {
        throw error;
      }
    }
  }
}

module.exports = AutoReddit;
