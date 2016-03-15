
// Made by Cr4xy

var agarClient = require("agario-client")
	config = require("./config.js"),
	token = null,
	account = new agarClient.Account(),
	STATIC_NAME = config.name,
	BOT_LIMIT = config.botLimit,
	debugObj = {},
	regions = config.regions;

account.c_user = config.c_user;
account.datr = config.datr;
account.xs = config.xs;

account.requestFBToken(function(tkn, info) {
    token = tkn;
});

var regionCounterFFA = 0,
	regionCounterParty = 0;

function getRegionFFA() {
	regionCounterFFA++;
	if (regionCounterFFA >= regions.length) regionCounterFFA = 0;
	return regions[regionCounterFFA];
}

function getRegionParty() {
	regionCounterParty++;
	if (regionCounterParty >= regions.length) regionCounterParty = 0;
	return regions[regionCounterParty];
}

var spawnTask = setInterval(function() {	
	if (token == null) return;
	agarClient.servers.getFFAServer({region: getRegionFFA()}, function(e) {
		var server = e.server;
		var key = e.key;
		if (ips.indexOf(server) != -1) return;
		start(server, key);
	});
	agarClient.servers.createParty({region: getRegionParty()}, function(e) {
		var server = e.server;
		var key = e.key;
		if (ips.indexOf(server) != -1) return; // EIGENTLICH 3X
		start(server, key);
	});
	if (bots.length >= config.botLimit) clearInterval(spawnTask);
}, 100);
var clientIdCounter = 0;
var bots = [];
var ips = [];

function start(server, key) {
	var myClient = new agarClient("Client_" + clientIdCounter++);
	ips.push(server);
	myClient.debug = 0;
	myClient.auth_token = token;
	myClient.on('disconnect', function() {
		if (bots.indexOf(myClient) >= 0) bots.splice(bots.indexOf(myClient), 1);
		if (ips.indexOf(server) >= 0) ips.splice(ips.indexOf(server), 1);
		clearInterval(myClient.sendInterval);
		myClient = null;
	});
	myClient.on('packetError', function(packet, error, preventCrash) {
		preventCrash();
	});
	myClient.on('connected', function() {
		bots.push(myClient);
		myClient.spawn(STATIC_NAME);
		myClient.sendInterval = setInterval(function() {
			function getDistance(cell1, cell2) {
				return Math.sqrt(Math.pow(cell1.x - cell2.x, 2) + Math.pow(cell2.y - cell1.y, 2));
			}
			var player = myClient.balls[myClient.my_balls[0]];
			if (!player) return;
			var nearest = null, nearestDist = 1000;
			for (var id in myClient.balls) {
				if (myClient.my_balls.indexOf(id) != -1) continue;            // Skip own cell
				var cell = myClient.balls[id];
				if (cell.virus) {
					nearest = cell;
					break;
				}
				if (cell.virus) continue;                                     // Skip virus
				if (cell.size * 1.25 > player.size) continue;                 // Skip bigger cells
				
				var dist = getDistance(cell, player);
				if (nearest && nearestDist < dist) continue;                  // Skip cells far away
				if (nearest && nearest.size > 20 && cell.size < 20) continue; // Skip food when found a player or ejected mass
				
				if (cell.size > 20 && cell.size * 4 < player.size) continue;  // Skip cells smaller than 4th or something
				
				nearest = cell;
				nearestDist = dist;
			}
			if (!nearest) return;
			
			myClient.moveTo(nearest.x, nearest.y);
		}, 40);
	});
	myClient.on('lostMyBalls', function() {
		myClient.spawn(STATIC_NAME);
	});
	myClient.connect("ws://" + server, key);
}

setInterval(function() {
	var totalScore = 0;
	for (var i in bots) totalScore += bots[i].score;
	var avgScore = (totalScore / bots.length).toFixed(0);
	debugObj.amount = bots.length;
	debugObj.totalScore = totalScore;
	debugObj.avgScore = avgScore;
	console.log(debugObj);
}, config.statusDelay);