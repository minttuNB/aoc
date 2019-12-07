var map = {}, parents = {}, dist = {
    "COM": 0
};
var objectRegExp = new RegExp(/(.{1,})\)(.{1,})/);
var data = require("fs").readFileSync("data.txt", "utf8").split("\n");
for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
    var line = data_1[_i];
    var parsed = objectRegExp.exec(line);
    if (map["" + parsed[1]]) {
        map["" + parsed[1]].push(parsed[2]);
        if (parents[parsed[2]]) {
            parents[parsed[2]].push(parsed[1]);
        }
        else {
            parents[parsed[2]] = [];
            parents[parsed[2]].push(parsed[1]);
        }
    }
    else {
        map["" + parsed[1]] = [];
        map["" + parsed[1]].push(parsed[2]);
        if (parents[parsed[2]]) {
            parents[parsed[2]].push(parsed[1]);
        }
        else {
            parents[parsed[2]] = [];
            parents[parsed[2]].push(parsed[1]);
        }
    }
}
function jump(cur) {
    if (map[cur]) {
        for (var _i = 0, _a = map[cur]; _i < _a.length; _i++) {
            var child = _a[_i];
            dist[child] = dist[cur] + 1;
        }
        for (var _b = 0, _c = map[cur]; _b < _c.length; _b++) {
            var child = _c[_b];
            jump(child);
        }
    }
    else
        return;
}
jump("COM");
var sum = 0;
for (var i in dist) {
    sum += dist[i];
}
console.log(sum);
//part 2
var hops = 0;
var found = false;
var curYOU = parents["YOU"], curSAN = parents["SAN"];
while (!found) {
    console.log(dist[curYOU], dist[curSAN]);
    if (dist[curYOU] > dist[curSAN]) {
        curYOU = parents[curYOU];
        hops++;
        continue;
    }
    else if (dist[curYOU] < dist[curSAN]) {
        curSAN = parents[curSAN];
        hops++;
        continue;
    }
    else {
        curYOU = parents[curYOU];
        curSAN = parents[curSAN];
        hops += 2;
    }
    if (parents[curYOU] == parents[curSAN]) {
        found = true;
        console.log(hops);
    }
}
