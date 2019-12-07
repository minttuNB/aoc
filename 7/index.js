var data = require("fs").readFileSync("./data.txt", "utf8").split(",").map(Number);
/*const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});*/
var IntcodeMachine = /** @class */ (function () {
    function IntcodeMachine(prog, inp) {
        this.halted = false;
        this.pos = 0;
        this.opCodes = {
            1: "ADD",
            2: "MUL",
            3: "INP",
            4: "OUT",
            5: "JIT",
            6: "JIF",
            7: "LTH",
            8: "EQU",
            99: "HLT"
        };
        this.opModes = {
            0: "POS",
            1: "IMM"
        };
        this.outputs = [];
        this.mem = prog;
        this.inputs = inp || [0, 0];
    }
    IntcodeMachine.prototype.parseOpCode = function (opCode) {
        opCode = opCode.toString();
        var length = opCode.length;
        return {
            code: Number("" + (opCode[length - 2] || 0) + opCode[length - 1]),
            modes: {
                p1: Number(opCode[length - 3]) || 0,
                p2: Number(opCode[length - 4]) || 0,
                p3: Number(opCode[length - 5]) || 0
            }
        };
    };
    IntcodeMachine.prototype.exec = function (f) {
        if (f === void 0) { f = this.mem; }
        while (!this.halted) {
            var op = this.parseOpCode(f[this.pos]);
            switch (op.code) {
                case 1: {
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
                        p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2]
                    };
                    f[f[this.pos + 3]] = params.p1 + params.p2;
                    this.pos += 4;
                    break;
                }
                case 2: {
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
                        p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2]
                    };
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
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1]
                    };
                    console.log("[" + this.opCodes[f[this.pos]] + "]: " + params.p1);
                    this.outputs.push(params.p1);
                    this.pos += 2;
                    break;
                }
                case 5: {
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
                        p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2]
                    };
                    if (params.p1 != 0) {
                        this.pos = params.p2;
                    }
                    else
                        this.pos += 3;
                    break;
                }
                case 6: {
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
                        p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2]
                    };
                    if (params.p1 == 0) {
                        this.pos = params.p2;
                    }
                    else
                        this.pos += 3;
                    break;
                }
                case 7: {
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
                        p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2]
                    };
                    params.p1 < params.p2 ? f[f[this.pos + 3]] = 1 : f[f[this.pos + 3]] = 0;
                    this.pos += 4;
                    break;
                }
                case 8: {
                    var params = {
                        p1: op.modes.p1 == 0 ? f[f[this.pos + 1]] : f[this.pos + 1],
                        p2: op.modes.p2 == 0 ? f[f[this.pos + 2]] : f[this.pos + 2]
                    };
                    params.p1 == params.p2 ? f[f[this.pos + 3]] = 1 : f[f[this.pos + 3]] = 0;
                    this.pos += 4;
                    break;
                }
                case 99: {
                    this.halted = true;
                    console.log("[" + this.opCodes[f[this.pos]] + "]: Halting machine...");
                    if (this.outputs.length > 0)
                        return this.outputs[this.outputs.length - 1];
                    break;
                }
                default: {
                    throw new Error("Invalid opcode, opcode: " + op.code + ", memdump: " + this.mem);
                    break;
                }
            }
        }
    };
    return IntcodeMachine;
}());
var permutator = function (inputArr) {
    var result = [];
    var permute = function (arr, m) {
        if (m === void 0) { m = []; }
        if (arr.length === 0) {
            result.push(m);
        }
        else {
            for (var i = 0; i < arr.length; i++) {
                var curr = arr.slice();
                var next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };
    permute(inputArr);
    return result;
};
var phases = [0, 1, 2, 3, 4];
var allPhaseCombinations = permutator(phases);
var lastOut = 0;
var values = [];
for (var _i = 0, allPhaseCombinations_1 = allPhaseCombinations; _i < allPhaseCombinations_1.length; _i++) {
    var com = allPhaseCombinations_1[_i];
    for (var _a = 0, com_1 = com; _a < com_1.length; _a++) {
        var i = com_1[_a];
        var machine = new IntcodeMachine(data, [i, lastOut]);
        var val = machine.exec();
        lastOut = val;
    }
    values.push(lastOut);
    lastOut = 0;
}
console.log(Math.max.apply(Math, values));
