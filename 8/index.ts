class Layer{
	constructor(data){
		this.rows = data.match((new RegExp(`.{${Layer.width}}`,"g")));
	}
	static width : number = 25;
	static height : number = 6;
	rows: string[] = [];
	digits = {};
}
let data : string[] = require("fs").readFileSync("./data.txt", "utf8").match((new RegExp(`.{${Layer.width*Layer.height}}`,"g")));
let layers : Layer[] = [];
for(let i of data){
	layers.push(new Layer(i));
}
for(let i in layers){
	for(let j of layers[i].rows){
		for(let a of j){
				if(!layers[i].digits[`${a}`]){
					layers[i].digits[`${a}`] = 0;
					layers[i].digits[`${a}`]++;
				}
				else layers[i].digits[`${a}`]++;
		}
	}
}
let leastZeroes = layers.filter(obj => {
	return obj.digits["0"] === Math.min.apply(Math, layers.map((o)=> { return o.digits["0"]; }));
});
console.log(leastZeroes[0]);
console.log(leastZeroes[0].digits["1"] * leastZeroes[0].digits["2"]);
