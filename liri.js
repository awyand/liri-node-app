
// Required modules
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var clear = require("clear");

// Import keys.js data and store to variables
var twitterClient = new Twitter(keys.twitter);
var spotifyClient = new Spotify(keys.spotify);

// Save OMDB API key to a variable
var omdbKey = "dea0b991";

// Save Twitter handle to object for Twitter API call
var twitterHandle = {screen_name: "Ed__The__Hyena"};

// Save process.argv and user command to variables
var arguments = process.argv;
var userCommand = arguments[2];

// Initialize userInput variable
var userInput;

// If user provided at least 1 input after command
if (arguments[3]) {
  // Construct userInput as a single string made up of arguments[3] through arguments[n]
  var userInputArr = [];
  for (i = 3; i < arguments.length; i++) {
    userInputArr.push(arguments[i]);
  }
  userInput = userInputArr.join(" ");
}

// Clear console
clear();

// Splash Screen
console.log(`\n
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::                                                                ::
::                                                                ::
::                           WELCOME TO                           ::
::                                                                ::
::                                                                ::
::             LLLL        IIII   RRRRRRRR       IIII             ::
::             LLLL        IIII   RRR     RRR    IIII             ::
::             LLLL        IIII   RRR     RRR    IIII             ::
::             LLLL        IIII   RRRRRRRRR      IIII             ::
::             LLLLLLLLL   IIII   RRR    RRR     IIII             ::
::             LLLLLLLLL   IIII   RRR      RRR   IIII             ::
::                                                                ::
::                                                                ::
::       Language Interpretation and Recognition Interface        ::
::                                                                ::
::                                                                ::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
\n`);

function determineFunction() {
  // Check to see if user entered a command
  // If a command was not entered, present user with available commands
  // If a command was entered, send to switch statemenet to determine next steps
  if (!userCommand) {
    console.log("LIRI Says: You didn't enter a command. Please try again with one of the following commands:");
    console.log("-- my-tweets");
    console.log("-- spotify-this-song (followed by song title)");
    console.log("-- movie-this (followed by movie title)");
    console.log("-- do-what-it-says (reads from a text file for command input)\n");
  } else {
    // userCommand switch statement
    switch(userCommand) {

      // If userCommand = my-tweets, display a message, pause, and call myTweets function
      case "my-tweets":
        console.log(`LIRI Says: Searching ${twitterHandle.screen_name}'s tweets...\n`);
        setTimeout(myTweets, 2000);
        break;

      // If userCommand = spotify-this-song
      case ("spotify-this-song"):
        // If user provided a song title
        if (userInput) {
          // Display message saying that LIRI is searching for that song
          console.log(`LIRI Says: Searching Spotify for ${userInput}...\n`);
        } else {
          // Otherwise display a message saying that LIRI is searching for a default song
          console.log("LIRI Says: You didn't specify a song, so I'll just search for Hakuna Matata for you...\n");
        }
        // Call spotifySong function after 2 seconds
        setTimeout(spotifySong, 2000);
        break;

      // If userCommand = movie-this
      case ("movie-this"):
        // If user provided a movie title
        if (userInput) {
          // Display a message saying that LIRI is searching for that movie
          console.log(`LIRI Says: Searching OMDB for ${userInput}...\n`);
        } else {
          // Otherwise display a message saying that LIRI is searching for a default movie
          console.log("LIRI Says: You didn't specify a movie, so I'll just search for The Lion King for you...\n");
        }
        // Call movieThis function after 2 seconds
        setTimeout(movieThis, 2000);
        break;

      // If userCommand = do-what-it-says, display a message, pause, and call doWhatItSays function
      case ("do-what-it-says"):
        console.log("LIRI Says: So demanding. Doing what it says, boss...\n");
        setTimeout(doWhatItSays, 2000);
        break;

      // If userCommand = anything other than the above cases, display an error message
      default:
        console.log(`LIRI Says: I'm sorry, "${userCommand}" is not a valid command. Please try again with one of the following commands:`);
        console.log("-- my-tweets");
        console.log("-- spotify-this-song (followed by song title)");
        console.log("-- movie-this (followed by movie title)");
        console.log("-- do-what-it-says (reads from a text file for command input)\n");
    }

    // Log date/time and command to log.txt
    var commandTime = moment().format();
    var logInput = "";
    if (userInput !== null && userInput !== "\n" && userInput !== undefined && userInput !== "") {
      logInput = userInput;
    } else {
      logInput = "N/A"
    }

    // As long as command wasn't "do-what-it-says", append a line break to log.txt
    // (do-what-it-says will add result in a line break being appended based on command in file)
    if (userCommand !== "do-what-it-says") {
      fs.appendFile("log.txt", `\n=====================================\n\nDate/Time: ${commandTime}\nCommand: ${userCommand}\nSearch Term: ${logInput}\nResult:\n`, function(err) {
        if(err) {
          console.log(err);
        }
      });
    }
  }
}



function myTweets() {
  // Make GET request to Twitter API
  twitterClient.get("statuses/user_timeline", twitterHandle, function(err, tweets, response) {
    // If no error was thrown
    if (!err) {

      // Clear console
      clear();

      // Log overview message
      console.log(`LIRI Says: Here the 20 most recent tweets from ${twitterHandle.screen_name} (all times local to you):\n`);

      var counter = 1;

      // Loop through the first 20 tweets returned in tweets (or all tweets if less than 20)
      for (i = 0; i < 20 && i < tweets.length; i++) {

        // Create momentjs object of created_at date/time
        var dateTime = moment(tweets[i].created_at, "ddd MMM DD HH:mm:ss ZZ YYYY");
        // Convert to desired format split into date and time
        var convertedDate = moment(dateTime).format("MMMM Do YYYY");
        var convertedTime = moment.parseZone(dateTime).local().format("HH:mm a");

        // Log Tweet #
        console.log(`Tweet #${counter}`);

        // Logic for how many equals are printed for clean formatting
        if (counter < 10) {
          console.log("========");
        } else {
          console.log("=========");
        }

        // Log tweet statement to console
        console.log(`At ${convertedTime} on ${convertedDate}, ${twitterHandle.screen_name} tweeted: ${tweets[i].text}\n`);

        // Append tweet statement to log.txt
        fs.appendFile("log.txt", `  At ${convertedTime} on ${convertedDate}, ${twitterHandle.screen_name} tweeted: ${tweets[i].text}\n`, function(err) {
          if(err) {
            console.log(err);
          }
        })

        // Increment counter
        counter++;
      }
    } else {
      // Otherwise log an error message
      console.log("LIRI Says: I'm sorry, I received an error. Please try again.\n");
    }
  });
}

function spotifySong() {

  // If user didn't provide a song, set it to a default song
  if (!userInput) {
    userInput = "Hakuna Matata";
  }

  // Spotify API request
  spotifyClient.search({type: "track", query: userInput, limit: 5}, function(err, data) {
    // If no error was returned
    if (!err) {
      // Initialize a counter (for display purposes)
      var counter = 1;
      // Save array of objects to a variable
      var songs = data.tracks.items;
      // For each result in array
      for (i = 0; i < songs.length; i++) {

        // Save returned artists array to variable
        var artists = songs[i].artists;
        // Initialize an array to add names to
        var artistsOutput = [];

        // Loop through each artist in artists array
        for (j = 0; j < artists.length; j++) {
          // Add name to artistsOutput array
          artistsOutput.push(artists[j].name);
        }

        // Save select values to variables
        var title = songs[i].name;
        var link = songs[i].preview_url;
        var album = songs[i].album.name;
        var artists = artistsOutput.join(", ");

        // Log select variables to console
        console.log(`Result #${counter}`);
        console.log("=========");
        console.log(`Artist(s): ${artists}`);
        console.log(`Title: ${title}`);
        console.log(`Album: ${album}\n`);

        // Logic for what gets displayed to console and log.txt, based on presence of link or not
        var logLink = "";
        if (link) {
          console.log(`Link: ${link}`);
          logLink = link;
        } else {
          logLink = "N/A";
        }

        // Append information to log.txt
        fs.appendFile("log.txt", `  Result #${counter}\n  =========\n  Artist(s): ${artists}\n  Title: ${title}\n  Link: ${logLink}\n  Album: ${album}\n\n`, function(err) {
          if(err) {
            console.log(err);
          }
        });

        // Increment counter
        counter++;
      }
    } else {
      // Otherwise log an error message
      console.log("LIRI Says: I'm sorry, I received an error. Please try again.\n");
      console.log(err);
    }
  });
}

function movieThis() {
  // If user did not provide a movie name, set userInput to "The Lion King"
  if (!userInput) {
    var omdbTitle = "The+Lion+King";
  } else {
    var omdbTitle = userInput.split(" ").join("+");
  }

  // Construct API request URL
  var queryURL = `http://www.omdbapi.com/?apikey=${omdbKey}&t=${omdbTitle}&plot=short`;

  // API request
  request(queryURL, function(err, response, info) {

    // Parse JSON string for ease of use
    var infoJSON = JSON.parse(info);

    // Logic for what gets logged and added to log.txt for IMDB rating, based on if a value is present or not
    var imdbRating = "";
    if (infoJSON.Ratings[0]) {
      imdbRating = infoJSON.Ratings[0].Value;
    } else {
      imdbRating = "N/A";
    }

    // Logic for what gets logged and added to log.txt for Rotten Tomatoes rating, based on if a value is present or not
    var rtRating = "";
    if (infoJSON.Ratings[1]) {
      rtRating = infoJSON.Ratings[1].Value;
    } else {
      rtRating = "N/A";
    }

    // Log required information to console
    console.log(`Title: ${infoJSON.Title}`);
    console.log(`Year: ${infoJSON.Year}`);
    console.log(`IMDB Rating: ${imdbRating}`);
    console.log(`Rotten Tomatoes Rating: ${rtRating}`);
    console.log(`Production Country: ${infoJSON.Country}`);
    console.log(`Language(s): ${infoJSON.Language}`);
    console.log(`Plot: ${infoJSON.Plot}`);
    console.log(`Actors: ${infoJSON.Actors}`);
    console.log("");

    // Append required information to log.txt
    fs.appendFile("log.txt", "  Title: " + infoJSON.Title + "\n"
      + "  Year: " + infoJSON.Year + "\n"
      + "  IMDB Rating: " + imdbRating + "\n"
      + "  Rotten Tomatoes Rating: " + rtRating + "\n"
      + "  Production Country: " + infoJSON.Country + "\n"
      + "  Language(s): " + infoJSON.Language + "\n"
      + "  Plot: " + infoJSON.Plot + "\n"
      + "  Actors: " + infoJSON.Actors + "\n", function(err) {
        if(err) {
          console.log(err);
        }
      });
  });
}

function doWhatItSays() {
  // Read from file
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log("LIRI Says: I'm sorry, I received an error. Please try again.\n");
    } else {
      // Split file contents into userCommand and userInput
      dataArr = data.split(",");
      userCommand = dataArr[0];
      userInput = dataArr[1];

      // Call determineFunction()
      determineFunction()
    }
  });
}

// Call determineFunction to begin
determineFunction();
