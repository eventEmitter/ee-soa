# ee-soa

A Framework for Service Oriented Applications

## installation

    npm install ee-soa

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-soa.png?branch=master)](https://travis-ci.org/eventEmitter/ee-soa)

## usage

	var SOA = require('ee-soa');


	var instance = new SOA();

	instance.use(new Transport());
	instance.use(new Service());
	instance.use(new Discovery());


