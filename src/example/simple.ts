import { SplitEqualLength, SplitEqualAmount, split, join } from '../buffer-split';
import { Buffer } from 'buffer';
import { inspect as _inspect } from 'util';

function inspect (v:any) { return _inspect(v, undefined, null, true); }

const
bufTest1 = new Buffer([
  1,0,0,0,0,
  2,0,0,0,0,
  3,0,0,0,0,
  4,0,0,0,0,
  5,0,0,0,0,
  6,0
]),
adapter1 = new SplitEqualLength(2),
adapter2 = new SplitEqualAmount(2),

bufTest1SplitEL = split(adapter1, bufTest1),
bufTest1SplitEA = split(adapter2, bufTest1);

console.log('bufTest1: %s', inspect(bufTest1));
console.log('bufTest1SplitEL: %s', inspect(bufTest1SplitEL));
console.log('bufTest1SplitEA: %s', inspect(bufTest1SplitEA))

const
bufTest1JoinEL = join(adapter1, bufTest1SplitEL),
bufTest1JoinEA = join(adapter2, bufTest1SplitEA);

console.log('bufTest1JoinEL: %s', inspect(bufTest1JoinEL));
console.log('bufTest1JoinEA: %s', inspect(bufTest1JoinEA));
