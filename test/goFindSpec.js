'use strict'

let chai 	=require('chai')
let expect 	=chai.expect
let assert 	=chai.assert
let _ 		=require('lodash')
let Gofind	=require('../index.js')

require('shelljs/global')
require('mocha-sinon')

describe("Gofind",function(){

	this.timeout(10000)

	let gfo = new Gofind()
	let optext = gfo._templates()
	let testDir = "/Users/"
	let log = function(l){ console.log(l); }
	let testText = "12345"

	it('should instaniate a Gofind object with certain properties',function(){
        assert.isObject(gfo);
        expect(gfo).to.have.property('startDirectory')
        expect(gfo).to.have.property('searchRecursive')
        expect(gfo).to.have.property('searchText')
        expect(gfo).to.have.property('caseSensitive')
        expect(gfo).to.have.property('wholeWord')
        expect(gfo).to.have.property('matchOutputFile')
        expect(gfo).to.have.property('writeMatchFile')
        expect(gfo).to.have.property('ignored')
        expect(gfo).to.have.property('ignoreOutputFile')
        expect(gfo).to.have.property('writeIgnoreFile')
        expect(gfo).to.have.property('quietMode')
    });

	it('should output "'+optext.NO_SEARCH_TEXT+'" when search is called if required searchText property is not set.',function(){
		let mock = this.sinon.mock(gfo)
		let ex = mock.expects('_log').once().withArgs(optext.NO_SEARCH_TEXT)
		gfo.run()
		ex.verify()
	})

	it('should output "'+optext.NO_START_DIR+'" when search is called if required startDirectory property is not set.',function(){
		let mock = this.sinon.mock(gfo)
		let ex = mock.expects('_log').once().withArgs(optext.NO_START_DIR)
		gfo.searchText = testText
		gfo.run()
		ex.verify()
	})

	it('should output "'+optext.START_TEXT+'" when all required properties are set.',function(){
		let find = this.sinon.spy(gfo,'_find')
		let mock = this.sinon.mock(gfo)
		let ex = mock.expects('_log').once().withArgs(optext.START_TEXT)
		gfo.searchText = testText
		gfo.startDirectory = testDir
		gfo.run()
		ex.verify()
		assert(find.called)
	})

	//TBD more tests, yo

})
