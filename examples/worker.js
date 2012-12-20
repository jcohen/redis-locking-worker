/*
Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var cluster = require("cluster");

var RedisLock = require("../");

var SUCCESS_CHANCE = 0.15;

var lock = new RedisLock({
	"lockKey" : "mylock",
	"statusLevel" : RedisLock.StatusLevels.Verbose,
	"lockTimeout" : 5000,
	"maxAttempts" : 5
});

lock.on("acquired", function(lastAttempt) {
	if (Math.random() <= SUCCESS_CHANCE) {
		console.log("Worker %d completed work successfully, last attempt?", cluster.worker.id, lastAttempt);
		lock.done(lastAttempt);
	} else {
		// oh no, we failed to do work!
		console.log("Worker %d failed to do work", cluster.worker.id);
	}	
});

lock.on("locked", function() {
	console.log("Worker %d did not acquire lock", cluster.worker.id);
});

lock.on("error", function(error) {
	console.error("Worker %d Error from lock: %j", cluster.worker.id, error);
});

lock.on("status", function(message) {
	console.log("Worker %d Status message from lock: %s", cluster.worker.id, message);
});

lock.acquire();