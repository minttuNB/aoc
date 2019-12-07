let map = {},
	parents = {},
	dist = {
		"COM": 0
	};
let objectRegExp = new RegExp(/(.{1,})\)(.{1,})/);
let data = require("fs").readFileSync("data.txt", "utf8").split("\n");
for (let line of data) {
	let parsed = objectRegExp.exec(line);
	if (map[`${parsed[1]}`]){
		map[`${parsed[1]}`].push(parsed[2]);
		if(parents[parsed[2]]){
			parents[parsed[2]].push(parsed[1])
		}
		else{
			parents[parsed[2]] = [];
			parents[parsed[2]].push(parsed[1])
		}
	} 
	else {
		map[`${parsed[1]}`] = [];
		map[`${parsed[1]}`].push(parsed[2]);
		if(parents[parsed[2]]){
			parents[parsed[2]].push(parsed[1])
		}
		else{
			parents[parsed[2]] = [];
			parents[parsed[2]].push(parsed[1])
		}
	}
}
function jump(cur) {
	if(map[cur]){
		for (let child of map[cur]) {
			dist[child] = dist[cur] + 1;
		}
		for (let child of map[cur])
			jump(child);
	}
	else return;
}
jump("COM");
let sum = 0;
for(let i in dist){
	sum+=dist[i];
}
console.log(sum);
//part 2
let hops : number = 0;
let found : boolean = false;
let curYOU = parents["YOU"], 
	curSAN = parents["SAN"];
while(!found){
	console.log(dist[curYOU], dist[curSAN]);
	if(dist[curYOU] > dist[curSAN]){
		curYOU = parents[curYOU];
		hops++;
		continue;
	}
	else if(dist[curYOU] < dist[curSAN]){
		curSAN = parents[curSAN];
		hops++;
		continue;
	}
	else{
		curYOU = parents[curYOU];
		curSAN = parents[curSAN];
		hops+=2;
	}
	if(parents[curYOU] == parents[curSAN]){
		found = true;
		console.log(hops);
	}
}