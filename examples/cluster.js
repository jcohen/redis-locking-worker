/*
Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var cluster = require("cluster");
var os = require("os");

var cpuCount = os.cpus().length;

cluster.setupMaster({
	exec : __dirname + "/worker.js",
});

for (var i = 0; i < cpuCount; i++) {
	cluster.fork();
}