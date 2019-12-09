function replaceAt(str, index, replacement) {
	console.log("replacing ", str[index], "with", replacement);
    return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
}
class Layer{
	constructor(data){
		this.rows = data.match((new RegExp(`.{${Layer.width}}`,"g")));
	}
	static width : number = 25;
	static height : number = 6;
	rows: string[] = [];
	digits = {};
}
class ElfImage{
	constructor(layers : Layer[]){
		this.rows = layers[layers.length-1].rows;
		layers.pop();
		for(let i=layers.length-1; i>=0; i--){
			console.log(`layer ${i}`);
			let currentLayer = layers[i];
			for(let j in currentLayer.rows){ //rows of each layer
				console.log(`row ${j}`);
				let row : any = currentLayer.rows[j];
				let currentRow = this.rows[j];
				for(let k in row){
					//console.log(`pixel ${k}`);
					if(row[k] == "2") continue;
					replaceAt(currentRow,k, row[k]);
				}
				this.rows[j] = currentRow;
			}
		}
	}
	rows: string[] = [];
}
let data : string[] = require("fs").readFileSync("./data.txt", "utf8").match((new RegExp(`.{${Layer.width*Layer.height}}`,"g")));
let layers : Layer[] = [];
for(let i of data){
	layers.push(new Layer(i));
}
for(let i in layers){ //iterate through layers
	for(let j of layers[i].rows){ //iterate through rows of each layer
		for(let a of j){ //iterate through digits of each row
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

//part 2
let finalImage = new ElfImage(layers);
console.log(finalImage.rows.join("\n"));