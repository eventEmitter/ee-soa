
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert')
		, Discovery 	= require('ee-soa-discovery-sameprocess')
		, Transport 	= require('ee-soa-transport-local')
		, Response 		= require('ee-soa-response')
		, Request 		= require('ee-soa-request')
		, SOAResponse 	= require('ee-soa-response');



	var   SOA = require('../')
		, soa
		, transport;



	describe('The SOA', function(){		
		it('should not throw when instantiated', function(){
			soa = new SOA();
		});

		it('should accept a discovery', function(){
			soa.use(new Discovery());
		});

		it('should accept a tranport', function(){
			transport = new Transport();
			soa.use(transport);
		});

		it('should accept a service', function(){
			soa.use({
				isService: function() {
					return true;
				}
				, request: function(request, response) {
					response.send(SOAResponse.statusCodes.OK, {});
				}
				, onLoad: function(callback){
					callback();
				}
				, getControllerNames: function() {
					return ['test'];
				}
				, on: function(){}
				, controller: 'test'
			});
		});

		it('should accept a tranport', function(){
			var response = new Response();
			transport.emit('request', new Request(), response);
		});
	});
	