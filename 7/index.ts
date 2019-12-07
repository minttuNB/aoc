let data: number[] = require("fs").readFileSync("./data.txt", "utf8").split(",").map(Number);
class IntcodeMachine {
	constructor(prog, inp?) {
		this.mem = prog;
		this.inputs = inp || [0, 0];
	}
	halted: boolean = false;
	pos: number = 0;
	inputs: number[];
	opCodes = {
		1: "ADD",
		2: "MUL",
		3: "INP",
		4: "OUT",
		5: "JIT",
		6: "JIF",
		7: "LTH",
		8: "EQU",
		99: "HLT"
	}
	opModes = {
		0: "POS",
		1: "IMM"
	}
	mem: number[];
	outputs: number[] = [];
	parseOpCode(opCode) {
		opCode = opCode.toString();
		let length = opCode.length;
		return {
			code: Number(`${opCode[length - 2] || 0}${opCode[length - 1]}`),
			modes: {
				p1: Number(opCode[length - 3]) || 0,
				p2: Number(opCode[length - 4]) || 0,
				p3: Number(opCode[length - 5]) || 0
			}
		}
	}
	exec(f: number[] = this.mem) {
		while (!this.halted) {
			let op = this.parseOpCode(f[this.pos]);
			switch (op.code) {
				case 1: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
						p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2],
					}
					f[f[this.pos + 3]] = params.p1 + params.p2;
					this.pos += 4;
					break;
				}
				case 2: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
						p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2],
					}
					f[f[this.pos + 3]] = params.p1 * params.p2;
					this.pos += 4;
					break;
				}
				case 3: {
					f[f[this.pos + 1]] = this.inputs[0];
					this.inputs = this.inputs.slice(1);
					this.pos += 2;
					break;
				}
				case 4: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
					}
					console.log(`[${this.opCodes[f[this.pos]]}]: ${params.p1}`);
					this.outputs.push(params.p1);
					this.pos += 2;
					break;
				}
				case 5: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
						p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2],
					}
					if (params.p1 != 0) {
						this.pos = params.p2;
					}
					else this.pos += 3;
					break;
				}
				case 6: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
						p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2],
					}
					if (params.p1 == 0) {
						this.pos = params.p2;
					}
					else this.pos += 3;
					break;
				}
				case 7: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
						p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2],
					}
					params.p1 < params.p2 ? f[f[this.pos + 3]] = 1 : f[f[this.pos + 3]] = 0;
					this.pos += 4;
					break;
				}
				case 8: {
					let params = {
						p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
						p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2],
					}
					params.p1 == params.p2 ? f[f[this.pos + 3]] = 1 : f[f[this.pos + 3]] = 0;
					this.pos += 4;
					break;
				}
				case 99: {
					this.halted = true;
					console.log(`[${this.opCodes[f[this.pos]]}]: Halting machine...`);
					if (this.outputs.length > 0) return this.outputs[this.outputs.length - 1];
					break;
				}
				default: {
					throw new Error("Invalid opcode, opcode: " + op.code + ", memdump: " + this.mem);
					break;
				}
			}
		}
	}
}
const permutator = (inputArr) => {
	let result = [];
	const permute = (arr, m = []) => {
		if (arr.length === 0) {
			result.push(m)
		} else {
			for (let i = 0; i < arr.length; i++) {
				let curr = arr.slice();
				let next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next))
			}
		}
	}
	permute(inputArr);
	return result;
}
let phases = [0, 1, 2, 3, 4];
let allPhaseCombinations = permutator(phases);
let lastOut: number = 0;
let values = [];
for (let com of allPhaseCombinations) {
	for(let i of com){
		let machine = new IntcodeMachine(data, [i, lastOut]);
		let val = machine.exec();
		lastOut = val;
	}
	values.push(lastOut);
	lastOut = 0;
}
console.log(Math.max(...values));