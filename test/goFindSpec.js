var chai 	=require('chai'),
	expect 	=chai.expect,
	assert 	=chai.assert,
	_ 		=require('lodash'),
	Gofind	=require('../index.js');

require('shelljs/global');
require('mocha-sinon');

describe("Gofind",function(){
	
	this.timeout(10000)

	var gfo = new Gofind(),
	optext = gfo._templates(),
	testDir = "/Users/",
	log = function(l){ console.log(l); },
	testText = "12345";

	it('should instaniate a Gofind object with certain properties',function(){  
        assert.isObject(gfo);
        expect(gfo).to.have.property('startDirectory');
        expect(gfo).to.have.property('searchRecursive');
        expect(gfo).to.have.property('searchText');
        expect(gfo).to.have.property('caseSensitive');
        expect(gfo).to.have.property('wholeWord');
        expect(gfo).to.have.property('matchOutputFile');
        expect(gfo).to.have.property('writeMatchFile');
        expect(gfo).to.have.property('ignored');
        expect(gfo).to.have.property('ignoreOutputFile');
        expect(gfo).to.have.property('writeIgnoreFile');
        expect(gfo).to.have.property('quietMode');
    });

	it('should output "'+optext.NO_SEARCH_TEXT+'" when search is called if required searchText property is not set.',function(){
		var mock = this.sinon.mock(gfo);
		var ex = mock.expects('_log').once().withArgs(optext.NO_SEARCH_TEXT);
		gfo.run();
		ex.verify();
	});

	it('should output "'+optext.NO_START_DIR+'" when search is called if required startDirectory property is not set.',function(){
		var mock = this.sinon.mock(gfo);
		var ex = mock.expects('_log').once().withArgs(optext.NO_START_DIR);
		gfo.searchText = testText;
		gfo.run();
		ex.verify();
	});

	it('should output "'+optext.START_TEXT+'" when all required properties are set.',function(){
		var find = this.sinon.spy(gfo,'_find')
		var mock = this.sinon.mock(gfo);
		var ex = mock.expects('_log').once().withArgs(optext.START_TEXT);
		gfo.searchText = testText;
		gfo.startDirectory = testDir;
		gfo.run();
		ex.verify();
		assert(find.called);
	});

	//TBD more tests, yo

});