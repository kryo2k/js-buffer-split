"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_split_1 = require("../buffer-split");
const buffer_1 = require("buffer");
const util_1 = require("util");
function inspect(v) { return util_1.inspect(v, undefined, null, true); }
const bufTest1 = new buffer_1.Buffer([
    1, 0, 0, 0, 0,
]), adapter1 = new buffer_split_1.SplitEqualLength(3), adapter2 = new buffer_split_1.SplitEqualAmount(3), bufTest1SplitEL = buffer_split_1.split(adapter1, bufTest1), bufTest1SplitEA = buffer_split_1.split(adapter2, bufTest1);
console.log('bufTest1: %s', inspect(bufTest1));
console.log('bufTest1SplitEL: %s', inspect(bufTest1SplitEL));
console.log('bufTest1SplitEA: %s', inspect(bufTest1SplitEA));
const bufTest1JoinEL = buffer_split_1.join(adapter1, bufTest1SplitEL), bufTest1JoinEA = buffer_split_1.join(adapter2, bufTest1SplitEA);
console.log('bufTest1JoinEL: %s', inspect(bufTest1JoinEL));
console.log('bufTest1JoinEA: %s', inspect(bufTest1JoinEA));
//# sourceMappingURL=simple.js.map