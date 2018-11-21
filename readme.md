[![](http://wes.io/kH9O/wowwwwwwwww.jpg)](https://LearnNode.com)

# Learn Node Starter Files + Stepped Solutions

These are the starter files and stepped solutions to accompany the LearnNode.com course.

You'll start your application in the `starter-files` directory — feel free to rename it.

If you need help, each folder number corresponds with where you should be at the *start* of a video. So if you are having trouble with video **24**, look to folder **25** for the answer.

The stepped solutions are meant for you to apply on top of your existing code - they don't stand on their own. 

Not all videos have a solution as their changes aren't significant enough.

## Getting Help

Need some help? Want to chat with the other learners? The Slack Chat that accompanies this course is where you should be asking questions — this repo is meant as a place to grab the starter files and isn't a support channel.

## Pull Requests

If you found a different / better way to solve problems in the application, great! These files are meant to be as close to 1:1 as they are shown in the videos so I generally won't accept any pull requests for changing how the application functions.

Glaring errors, clarifications and files that aren't shown in the videos are totally fair game for pull requests and are appreciated.

Enjoy!

## FAQ

### The Google Maps API key isn't working

The course might have hit a limit with the API key — if this is the case you need to sign up for your own API key over at <https://developers.google.com/maps/documentation/javascript/usage>. You will need to enable static maps for your API key. [Here is a quick video on how to do this](http://wes.io/khGn). 

Once you have the API key, simply place it in your `variables.env` file and restart.

### I'm getting errors related to `/data/db` like `code:100` and `connection failed`

Check out [this answer](https://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder#answer-7948986) on stack overflow to get mongoDB running locally.

## I'm getting a `URIError: URI malformed` error when running `npm start`

Thanks to [Chris Ellinger](https://twitter.com/devoidofgenius) for this: 

> If you’re getting a `URIError: URI malformed` error when running `npm start`, break out your environment variables. Go into `variables.env` and split the URI like this `MONGO_URI=mongodb://host.com:port` `DB_USER=username` and `DB_PASS=password`. Then inside your `start.js` replace `mongoose.connect(process.env.DATABASE)` with `mongoose.connect(process.env.MONGO_URI, {user: process.env.DB_USER, pass: process.env.DB_PASS});`. I had issues connecting to my mongodb because my password contained symbols.
