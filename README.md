# LIRI
Language Interpretation and Recognition Interface (LIRI) Node Application

## Description

Language Interpretation and Recognition Interface (LIRI) is a simple Node.js application that executes a number of API requests based on user input.  LIRI is capable of retrieving tweets from the [Twitter API](https://developer.twitter.com/en.html), song information from the [Spotify API](https://developer.spotify.com/), and movie information from the [OMDB API](http://www.omdbapi.com/).  It can also execute API requests based on the content of a text file.  LIRI displays request information and results in the console and also logs both to a text file for future review.

## Installation

LIRI utilizes Node Package Manager (NPM) to install API dependencies and enable additional features.  You will need to install a number of packages as well as obtain API keys in order to use LIRI.

### Clone LIRI Repository

In the console, navigate to the directory where you wish to install LIRI.  Type ```git clone https://github.com/awyand/liri-node-app.git``` to clone the LIRI repository.  This will create a local copy of LIRI files on your system.

### Packages

All dependencies are tracked in the provided package.json and package-lock.json files.  In the console, navigate into the cloned directory ("liri-node-app") and type ```npm install```  This will install the following NPM packages:

* [Twitter API](https://www.npmjs.com/package/twitter)
* [Spotify API](https://www.npmjs.com/package/node-spotify-api)
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [Request](https://www.npmjs.com/package/request)
* [Clear](https://www.npmjs.com/package/clear)
* [Moment](https://www.npmjs.com/package/moment)

### API Keys

You will need to obtain API keys for the Twitter and Spotify APIs.  Use the links in the Description section to obtain them.  Once you've obtained your keys, create a file named .env within the "liri-node-app" directory and save your keys and secrets like this:

```
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```

LIRI will take care of the rest by loading your keys from your .env file at runtime.

## User Guide

Once LIRI is installed, it's time to start making requests.  LIRI accepts the following commands:

* my-tweets
* spotify-this-song
* movie-this
* do-what-it-says

Running any of these commands will print results to your console as well as to a log file named log.txt.  Since this file is not included in the repo (using .gitignore), it will be created the first time you request something through LIRI.

### my-tweets

The my-tweets command does not require any additional input.  By default, it will retrieve the most recent 20 tweets from the Twitter account Ed__The__Hyena.  If you'd like to change the account, open up liri.js and find the following code:

```
var twitterHandle = {screen_name: "Ed__The__Hyena"};
```

Replace Ed__The__Hyena with your desired Twitter handle.

Execution Example:

```
node liri.js my-tweets
```

### spotify-this-song

The spotify-this-song accepts additional input. A song title should follow the "spotify-this-song" command in the  console.  This will retrieve up to five of the closest matches to your query and provide select information on the tracks.

Execution Example:

```
node liri.js spotify-this-song Stairway to Heaven
```

If you do not provide a song title, LIRI defaults to Hakuna Matata.

### movie-this

The movie-this command accepts additional input.  A movie title should follow the "movie-this" command in the console.  This will retrieve select information on the specified movie.  

Execution Example:

```
node liri.js movie-this Die Hard
```

If you do not provide a song title, LIRI defaults to The Lion King.

### do-what-it-says

The do-what-it-says command does not require any additional input.  Instead, it reads from a file named random.txt.  This file is meant to contain a comma-separated command and user input.

File Example:

```
spotify-this-song,Stairway to Heaven,
```

For optimal performance, there should be a comma after each argument, including the second argument in the example above and the single argument in the case of a command that doesn't require additional input, for example:

```
my-tweets,
```
