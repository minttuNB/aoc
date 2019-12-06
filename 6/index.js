var map = {}, dist = {
    "COM": 0
};
var objectRegExp = new RegExp(/(.{1,})\)(.{1,})/);
var data = require("fs").readFileSync("data.txt", "utf8").split("\n");
for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
    var line = data_1[_i];
    var parsed = objectRegExp.exec(line);
    if (map["" + parsed[1]])
        map["" + parsed[1]].push(parsed[2]);
    else {
        map["" + parsed[1]] = [];
        map["" + parsed[1]].push(parsed[2]);
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
