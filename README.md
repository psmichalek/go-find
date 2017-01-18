# Go-Find
Simple module for doing a basic text search in files on your file system. Upon calling the run() method it will output the list of file containing the matches on the search text into a specified file. Also here is the finder script that will call go-find with some prompts on the command line to do the text search for you.

It uses [recursive-readdir](https://www.npmjs.com/package/recursive-readdir) module for searching so please refer to that for more information on how it's doing the search.

Uses the Javscript [match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) method to actually do the match on the text.

## Useage

**Quick Search:** run "npm start" and follow the prompts.

If you want to skip all the prompts, open the **finder.js** file and set the **GO_MODE** const to true (also set **BASE_PATH** to whatever directory you want it to start searching from). Once you've entered all info at the prompts the search will run and info will be displayed to the screen about what happened. If you chose to output the results to a file, that file will contain matches for the text along with what lines in the file actually contained the text.

Running finder:

![screenshot](/screenshot-1.png)


Output file example:

![screenshot2](/screenshot-2.png)

If you want to write you're own script to use the go-find module instanciate a gofind object, set the properties then call the run() method.

```javascript
var gofind = require('go-find');

var finder              = new gofind();
finder.startDirectory   = "/Users/ollie/wwwroot/";
finder.searchRecursive  = true;
finder.searchText       = "Mystery Man";
finder.caseSensitive    = true;
finder.wholeWord        = true;
finder.ignored          = [".svn","test","about.html"];
finder.matchOutputFile  = "/Users/ollie/wwwroot/sickwebapp/logs/mysteryman_matches.txt";
finder.ignoreOutputFile ='/Users/ollie/wwwroot/sickwebapp/logs/ignored.txt';
finder.showMatchLineNumbers = true;
finder.quietMode        = false;
finder.writeMatchFile   = false;
finder.writeIgnoreFile  = false;

// Call run to execute the search
finder.run();

```

## Mutable Properties (options, yo)
The following properties can be set on the gofind object.


**startDirectory** 		- Full path to the directory on your filesystem to begin the search - full file path (string) - _undefined_ - Yes

**searchRecursive** 	- Flag to search recursively from startDirectory (by default just searches files in the start directory) - true or false (boolean) - _false_ - No

**searchText** 			- The text to search for in files - some text (string) - _undefined_ - Yes

**caseSensitive** 		- Flag to indicate whether the searchText match should be case-sensative or not - true or false (boolean) - _false_ - No

**wholeWord** 			- Flag to indicate whether or not to match on a whole word only or match only - true or false (boolean) - _true_ - No

**matchOutputFile** 	- The full path to a file that will have a list of files containing the search text - full path to a file (string) - _matched.txt_ - No

**writeMatchFile** 		- Flag to indicate if you don't want it to produce a file with list of matches (i.e. outputFile) - true or false (boolean) - _false_ - No

**showMatchLineNumbers** - Flag to indicate if the output text file should include the matching line number and line of where match was found -  - true or false (boolean) - _false_ - No

**ignored** 			- Files or directories that will be ignored - array of strings that can be a directory or a specific file - _empty array_ - No

**ignoreOutputFile** 	- The full path to a file that will have a list of files and directories that were ignored - full path to a file (string) - _ignored.txt_ - No

**writeIgnoreFile** 	- Flag to indicate if you don' want it to produce a file with a list of files or directory ignored when searching - true or false (boolean) - _true_ - No

**quietMode** 			- Flag to turn on or off the console output - true or false (boolean) - _false_ - No

##Tests
Run npm test to fire off the specs in the tests directory. Feel free to write some more tests for it, I did not go HAM on tests for this guy.
