let map = {},
	dist = {
		"COM": 0
	};
let objectRegExp = new RegExp(/(.{1,})\)(.{1,})/);
let data = require("fs").readFileSync("data.txt", "utf8").split("\n");
for (let line of data) {
	let parsed = objectRegExp.exec(line);
	if (map[`${parsed[1]}`]) map[`${parsed[1]}`].push(parsed[2]);
	else {
		map[`${parsed[1]}`] = [];
		map[`${parsed[1]}`].push(parsed[2]);
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