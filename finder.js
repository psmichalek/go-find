'use strict'

// Environment
const BASE_PATH = __dirname

// set to true and it will only prompt for what text you want to search for
const GO_MODE = false

// Defaults
let defaultIgnoreFile=__dirname+'/logs/ignored.txt'
let defaultMatchFile=__dirname+'/logs/matched.txt'
let defulatStartPath = BASE_PATH
let prompt = require('prompt')
let colors = require('colors/safe')
let _ = require('lodash')

let pSchema = getschema();
prompt.message = ''
prompt.delimiter = ''
prompt.start()
prompt.get(pSchema,function(err,vals){

	let gofind = require('./index.js')
	let finder              = new gofind()
	finder.startDirectory   = (typeof vals.start!=='undefined') ? vals.start : defulatStartPath
	finder.searchRecursive  = true
	finder.searchText       = vals.searchText
	finder.caseSensitive    = true
	finder.wholeWord        = true
	finder.ignored          = [".svn"]
	finder.matchOutputFile  = (typeof vals.matchFile!=='undefined') ? vals.matchFile : defaultMatchFile
	finder.ignoreOutputFile = (typeof vals.ignoreFile!=='undefined') ? vals.ignoreFile : defaultIgnoreFile
	finder.showMatchLineNumbers = true
	finder.quietMode        = false
	finder.writeMatchFile   = (typeof vals.writeMatch==='undefined') ? true:(vals.writeMatch=='y') ? true: false
	finder.writeIgnoreFile  = (typeof vals.writeIgnore!=='undefined' && vals.writeIgnore=='y') ? true : false
	if(typeof vals.diagmode!=='undefined' && vals.diagmode=='y') finder.quietMode=false
	finder.run()

});

function qtext(m){ return colors.green(m); }

function getschema(){
	let prompts = {}

	prompts.searchText =
	{
		description : qtext(' Text to find:'),
		type:'string',
		default:'',
		required:true,
		message:colors.red(' Need something to find brah!')
	}

	prompts.start =
	{
		description : qtext(' Path to start searching:'),
		type:'string',
		default:defulatStartPath,
		ask:function(){ return !GO_MODE }
	}

	prompts.writeMatch =
	{
		pattern:/^[yn]+$/,
		description: qtext(' Write matches to a file? [y/n]?'),
		type:'string',
		default:'y',
		message:'answer y or n',
		ask:function(){ return !GO_MODE }
	}

	prompts.matchFile =
	{
		description : qtext(' Path to file that has the matches shown:'),
		type:'string',
		default:defaultMatchFile,
		ask:function(){ if(!GO_MODE) return prompt.history('writeMatch').value=='y'; else return false }
	}

	prompts.writeIgnore =
	{
		pattern:/^[yn]+$/,
		description: qtext(' Write ignored filenames (ones not searched) to a file? [y/n]?'),
		type:'string',
		default:'n',
		message:'answer y or n',
		ask:function(){ return !GO_MODE }
	}

	prompts.ignoreFile =
	{
		description : qtext(' Path to output of files ignored:'),
		type:'string',
		default:defaultIgnoreFile,
		ask:function(){ if(!GO_MODE) return prompt.history('writeIgnore').value=='y'; else return false }
	}

	prompts.diagmode =
	{
		pattern:/^[yn]+$/,
		description: qtext(' Run in diagnostic mode [y/n]?'),
		type:'string',
		default:'n',
		message:'answer y or n',
		ask:function(){ return !GO_MODE }
	}

	return { properties : prompts }

}
