# Go-Find
Simple Node module for doing a basic text search in files on your file system. Upon calling the run() method it will output the list of file containing the matches on the search text into a specified file.

It uses [recursive-readdir](https://www.npmjs.com/package/recursive-readdir) module for searching so please refer to that for more information on how it's doing the search.

Uses the Javscript [match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) method to actually do the match on the text.

## Useage
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

// Notes
// It will ignore the .svn, test directories and any file named about.html
// The file /Users/ollie/wwwroot/sickwebapp/logs/mysteryman_matches.txt will contain a list of files that the text appears in
// The file /Users/ollie/wwwroot/sickwebapp/logs/ignored.txt will contain the files and directories that were ignored in the search

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


