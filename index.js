/*!
 * Node.JS module "Go Find!"
 * @description will search files for specified string and output files with matches to specified text file 
 * @author Paul S Michalek (psmichalek@gmail.com)
 * @license MIT
 *
 * The MIT License (MIT)
 */
 
var fs 			= require('fs'),
	path 		= require('path'),
	recursive 	= require('recursive-readdir'),
	_ 			= require('lodash'),
	readln	 	= require('readline'),
	Q 			= require('q'),
	moment 		= require('moment');
	
require('shelljs/global');

var GoFind = function(){
	if (!(this instanceof GoFind) ) return new GoFind();
	
	// Private properties
	this._totaldirs=[];
	this._totalfiles=[];
	this._ignorefiles=[];
	this._ignoredirs=[];
	this._matchedfiles=[];
	this._matchRe = '';
	this._defaultMatchFile='matched.txt';
	this._defaultIgnoreFile='ignored.txt';

	// Public properties
	this.startDirectory=undefined;
	this.searchRecursive=false;
	this.searchText=undefined;
	this.caseSensitive=false;
	this.wholeWord=true;
	this.matchOutputFile=this._defaultMatchFile;
	this.writeMatchFile=true;
	this.showMatchLineNumbers=false;
	this.ignored=[];
	this.ignoreOutputFile=this._defaultIgnoreFile;
	this.writeIgnoreFile=true;
	this.quietMode=false;
}

GoFind.prototype.run = function(){
	var self = this;
	var optext 	= self._templates();
	if( typeof self.searchText==='undefined' ) self._log(optext.NO_SEARCH_TEXT);
	else if( typeof self.startDirectory==='undefined' ) self._log(optext.NO_START_DIR);
	else if( !test('-e',self.startDirectory) ) self._log(optext.START_DIR_NOT_FOUND);
	else self._find()
}

GoFind.prototype._find = function(){
	var self = this;
	var optext 	= self._templates(),
		matchers = [];
	var setMatchFlag = function(){ var i=self.caseSensitive; var g=self.wholeWord; return (i&&g)?"gi":(i)?"i":(g)?"g":""; }
	self._matchRe = new RegExp(self.searchText, setMatchFlag() );
	self._log(optext.START_TEXT);
	self._getfiles(function(files){ 
		
		if(self.writeMatchFile && !self.showMatchLineNumbers) {
			_.each(files,function(file){ 
				if( fs.readFileSync(file,'utf8').match(self._matchRe) ) self._matchedfiles.push({file:file,lines:[]}); 
			});
			self._report();
		}else if(self.writeMatchFile && self.showMatchLineNumbers){
			
			self._readlines(files,function(err){
				if(err) console.log(err);
				self._report();
			});

		}

	});
}

GoFind.prototype._readlines = function(files,callback){
	var self = this;
	var filecoll =  files.slice(0);
	(function readOneFile(){
		var file = filecoll.splice(0,1)[0];
		self._matchme(file,function(err){
			if (err){ callback(err); return }
			if (filecoll.length==0) callback();
			else readOneFile();
		});
	})();
}

GoFind.prototype._matchme = function(file,cb){
	var self = this;
	var rl = readln.createInterface({ input: fs.createReadStream(file) });
	var ln =0, matchedlines = [];

	rl.on('line', function(line){
		ln=ln+1;
	  	if( line.match(self._matchRe) ) matchedlines.push({line:ln,text:line}); 
	});

	rl.on('close',function(){
		if(matchedlines.length>0) self._matchedfiles.push({file:file,lines:matchedlines});
		cb();
	});

}

GoFind.prototype._templates = function(){
	var self = this;
	var statstpml			='\n ******************************************\n'+
							' * Search Text: "{searchText}" \n'+
							' * Starting Directory: {startDirectory}\n'+
							' * Using Recursion: {searchRecursive}\n'+
							' * Files With Match: {matchedfilesLen} out of {totalfilesLen}\n'+
							' * Case Sensitive Matching: {caseSensitive}\n'+
							' * Whole Word Only Matching: {wholeWord}\n';
	if(self.writeMatchFile)  statstpml=statstpml+' * Matched files in: {matchOutputFile}\n';
	if(self.writeIgnoreFile) statstpml=statstpml+' * Skipped directories: {ignoredirsLen} out of {totaldirsLen}\n';
	if(self.writeIgnoreFile) statstpml=statstpml+' * Skipped files: {ignorefilesLen} out of {totalfilesLen}\n';
	if(self.writeIgnoreFile) statstpml=statstpml+' * Ignored in: {ignoreOutputFile}\n';
	statstpml				=statstpml+' ******************************************';
	
	var t = {};
	t.NO_SEARCH_TEXT 		=' No search text set.';
	t.NO_START_DIR			=' No starting directory was set.';
	t.START_DIR_NOT_FOUND	=' Starting directory was not found.';
	t.OUTPUT_FILE_HEADER	='\n'+
							' ******************************************\n'+
							' * Matched: "{searchText}"\n'+
							' * Starting: {startDirectory}\n'+
							' * Files With Match: {matchedfilesLen} out of {totalfilesLen}\n'+
							' * Run On: {date}\n'+
							' ******************************************\n'+
							'\n';
	t.IGNORE_FILE_HEADER	='\n'+
							' ******************************************\n'+
							' * Search Text: "{searchText}" \n'+
							' * Starting Directory: {startDirectory}\n'+
							' * Skipped directories: {ignoredirsLen} out of {totaldirsLen}\n'+
							' * Skipped files: {ignorefilesLen} out of {totalfilesLen}\n'+
							' * Run On: {date} \n'+
							' ******************************************\n'+
							'\n';
	t.START_TEXT			='\n Starting search '+moment().format("MM/DD/YYYY hh:mm:ss A");
	t.CONSOLE_STATS = statstpml;
	t.ERROR_CREATE_MATCH_FILE 	= ' Could not create the file '+self.matchOutputFile +'. Make sure directory exists.';		
	t.ERROR_CREATE_IGNORE_FILE 	= ' Could not create the file '+self.ignoreOutputFile+'. Make sure directory exists.';	
	return t;	
}

GoFind.prototype._render = function(templ,callback){
	var self = this;
	if(typeof templ!='undefined'){
		
		templ=templ.replace(/\{searchText}/g,self.searchText);
		templ=templ.replace(/\{startDirectory}/g,self.startDirectory);
		templ=templ.replace(/\{caseSensitive}/g,self.caseSensitive);
		templ=templ.replace(/\{wholeWord}/g,self.wholeWord);
		templ=templ.replace(/\{searchRecursive}/g,self.searchRecursive);

		templ=templ.replace(/\{matchOutputFile}/g,self.matchOutputFile);
		templ=templ.replace(/\{ignoreOutputFile\}/g,self.ignoreOutputFile);

		templ=templ.replace(/\{matchedfilesLen\}/g,self._matchedfiles.length);
		templ=templ.replace(/\{ignoredirsLen\}/g,self._ignoredirs.length);
		templ=templ.replace(/\{ignorefilesLen\}/g,self._ignorefiles.length);

		templ=templ.replace(/\{totaldirsLen\}/g,self._totaldirs.length);
		templ=templ.replace(/\{totalfilesLen\}/g,self._totalfiles.length);
		
		templ=templ.replace(/\{date\}/g,moment().format("MM/DD/YYYY hh:mm:ss A"));
	}
	callback(templ);
}

GoFind.prototype._report = function(){
	var self = this;
	var setFile = function(file,type){
		
		var pathDir=file.match(/(.*)[\/\\]/)[1]||'';
		if(!self.quietMode) self._log('pathDir = '+pathDir);

		var dirExists=(pathDir!='') ? test('-e',pathDir) : true; 
		if(!self.quietMode) self._log('dirExists = '+dirExists);

		if ( !dirExists ) { 
			mkdir('-p',pathDir); 
			if(!self.quietMode) self._log(' Directory "'+pathDir+'" was not found so it was created.'); 
		}

		var isDirOnly = test('-d',file); 
		if(!self.quietMode) self._log('isDirOnly = '+isDirOnly);

		if ( isDirOnly ) {
			var endsInSlash = ( file.match(/.*\//)===null ) ? '/' : '';
			var defaultName = (type=='match') ? endsInSlash+self._defaultMatchFile : endsInSlash+self._defaultIgnoreFile;
			file = file + defaultName;
			if(!self.quietMode) self._log(' No filename was found in the '+type+' output file path so '+defaultName+' was added to the path.');
		}

		var fileExists = test('-e',file); 
		if(!self.quietMode) self._log('fileExists = '+fileExists);

		if ( fileExists ) {
			rm('-f',file);
			if(!self.quietMode) self._log(' The old '+type+' output file was removed and will be replaced with current results.');
		}

		try { 
			touch(file); 
			if(!self.quietMode) self._log(' '+file+' created ');
		} catch(e){}

		return test('-e',file);

	}
	var optext 	= self._templates();
	
	// Write stats to console
	if(!self.quietMode) self._render(optext.CONSOLE_STATS,function(t){ self._log(t); });
	else self._log(' '+self._matchedfiles.length+' matches found, check output file for details.');
	
	// Write matched stats to file
	if(self.writeMatchFile){
		if(setFile( self.matchOutputFile,'match' )){
			self._render(optext.OUTPUT_FILE_HEADER,function(header){ 
				header.toEnd( self.matchOutputFile );
				_.each(self._matchedfiles,function(mf){
					var sout='';
					if(self.showMatchLineNumbers) {
						sout=sout+' -----------------------------------------\n';
						sout=sout+' '+mf.file+'\n';
						_.each(mf.lines,function(ll){
							sout=sout+'  '+ll.line+': '+ll.text+'\n';
						});
					}else{
						sout=sout+mf.file+'\n';
					}
					sout.toEnd( self.matchOutputFile );
				});
			});			
		} else self._log( optext.ERROR_CREATE_MATCH_FILE );
	}

	// Write ignore stats to file
	if(self.writeIgnoreFile){
		if(setFile( self.ignoreOutputFile,'ignore' )){
			self._render(optext.IGNORE_FILE_HEADER,function(t){
				t.toEnd( self.ignoreOutputFile );
				_.each(self._ignorefiles,function(f){ var ff=f+'\n'; ff.toEnd(self.ignoreOutputFile); });
				_.each(self._ignoredirs,function(f){ var fff=f+'\n'; fff.toEnd(self.ignoreOutputFile); });
			});
		} else self._log( optext.ERROR_CREATE_IGNORE_FILE );
	}

}

GoFind.prototype._getfiles = function(cb){
	var self = this;
	recursive(self.startDirectory,[ignoresCb],recursiveCb);
	function ignoresCb(file,stats){
		var ignoreme=false;
		
		// Collect some stats
		if( stats.isDirectory() ) self._totaldirs.push(path.basename(file));
		else self._totalfiles.push(file);
		
		// Eval to see if gonna ignore it
		if( !self.searchRecursive && stats.isDirectory() ) { ignoreme=true; self._ignoredirs.push(file); }
		else if( self.ignored.length>0 && _.find(self.ignored,function(v){return path.basename(file)==v; }) ) { ignoreme=true; self._ignorefiles.push(file); }
		return ignoreme;
	}
	function recursiveCb(err,files){
		if(err) console.log(' Error ',err);
		else cb(files);
	}
}

GoFind.prototype._log = function(txt){ console.log(txt); }

module.exports = GoFind
