!function(){

	var   Class 		    = require('ee-class')
        , EventEmitter      = require('ee-event-emitter')
		, log 			    = require('ee-log')
        , type              = require('ee-types')
        , semver            = require('semver')
        , ServiceManager    = require('ee-soa-service-manager')
        , DiscoveryManager  = require('ee-soa-discoverymanager')
        , TransportManager  = require('ee-soa-transportmanager')
        , DiscoveryResponse = require('ee-soa-discovery-response');



	module.exports = new Class({
        inherits: EventEmitter


		, init: function(options) {
            this._initializeManagers();
		}



        , use: function(component) {
            if (type.function(component.isTransport) && component.isTransport()) {
                this._useTransport(component);
            }
            else if (type.function(component.isService) && component.isService()) {
                this._useService(component);
            }
            else if (type.function(component.isDiscovery) && component.isDiscovery()) {
                this._useDiscovery(component);
            }
            else throw new Error('Accepting components of the type transport, discovery or service on the «use» method, you tried to add somthing else ...');

            return this;
        }




        , end: function() {
            return Promise.all(Array.from(this.services.services.values()).map(service => service.end()));
        }



        , load: function() {
            return this.services.load();
        }



		/**
		 * returns a map of all controllers
		 */
		, getControllerMap: function() {
			var map = {};

			return this.services.getControllerMap(map);
		}


        , _useService: function(service) {
            this.services.use(service);
        }

        , _useTransport: function(transport) {
            this.transport.use(transport);
        }

        , _useDiscovery: function(discovery) {
            this.discovery.use(discovery);
        }



        , _handleRequest: function(request, response) {
            if (request.getDiscovery() === 'discovered') {
                this.services.request(request, response);
            }
            else {
                this._discover(request, response);
            }
        }



        , _discover: function(request, response) {
            // dummy discovery
            this.discovery.discover('', '', function(err, discoverResponse){
                if (discoverResponse.status === DiscoveryResponse.statuses.Found) {
                    this.transport.request(discoverResponse.transport, request, response);
                }
                else {
                    response.send(response.statusCodes.TARGET_NOT_FOUND);
                }
            }.bind(this));
        }




        /*
         * The _initializeManagers method initilaizes the service,
         * discovery & transport managers
         *
         */
        , _initializeManagers: function() {
            this.services = new ServiceManager();
            this.discovery = new DiscoveryManager();
            this.transport = new TransportManager();

            // if a service has an outgoing request it needs resources
            // from another service.
            this.services.on('request', this._handleRequest.bind(this));
            this.transport.on('request', this._handleRequest.bind(this));
        }
	});
}();
