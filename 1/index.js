const r = require("readline").createInterface({
	input: require("fs").createReadStream("./data.txt")
});
function fuel(x){
	return Math.floor(x / 3)-2;
}
let sum1 = 0,
	sum2 = 0;
r.on("line", (line) => {
	sum1+=fuel(line);
	let x = fuel(line);
	while(x>0){
		sum2+=x;
		x = fuel(x);
	}
});
r.on("close", () => {
	console.log("The total fuel requirement is", sum1, ", part 2:", sum2);
});