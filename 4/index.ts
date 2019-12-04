let data : number[] = [264360, 746325];
let hits1 : number = 0,
	hits2 : number = 0;
for(let i=data[0]; i<=data[1]; i++){
	let meetsCriteria : boolean = false;
	//check for adjacent
	const num = Array.from(i.toString());
	if(/(.)\1/.test(i.toString())){
		let last = -99;
		for(let j of num){
			if(Number(j) < last){
				meetsCriteria = false;
				break;
			}
			else meetsCriteria = true;
			last = Number(j);
		}
	}
	if(meetsCriteria){
		hits1++;
	}
}
//part 2 wip
for(let i=data[0]; i<=data[1]; i++){
	let meetsCriteria : boolean = false;
	//check for adjacent
	const num = Array.from(i.toString());
	if(/(.)\1/.test(i.toString())){
		let dblAdj = /(.)\1/.exec(i.toString())[1];
		let noMo = new RegExp(`(${Number(dblAdj)})\\1\\1`);
		if(!noMo.test(i.toString())){
			let last = -99;
			for(let j of num){
				if(Number(j) < last){
					meetsCriteria = false;
					break;
				}
				else meetsCriteria = true;
				last = Number(j);
			}
		}
	}
	if(meetsCriteria){
		hits2++;
	}
}
console.log("Amount of hits in part1:", hits1);
console.log("Amount of hits in part2:", hits2);