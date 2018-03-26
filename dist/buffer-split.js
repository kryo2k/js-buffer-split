"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
;
;
/**
* Abstract adapter for splitting a B
*/
class SplitAdapter {
    /**
    * Compute the length of a single B.
    */
    getByteLength(b) {
        return b.byteLength;
    }
    /**
    * Compute the total length of an array of B.
    */
    totalByteLength(arr, previousLength = 0) {
        return arr.reduce((p, c) => p + this.getByteLength(c), previousLength);
    }
    /**
    * Basic public join function
    */
    join(arr, target, targetOffset = 0) {
        const arrLength = arr.length, arrByteLength = this.totalByteLength(arr);
        if (typeof target === 'undefined')
            target = new buffer_1.Buffer(arrByteLength);
        const write = this.createWriter(target, targetOffset, arrByteLength);
        let pieceIndex = 0, wroteBytes = 0, lWriteBytes;
        while (pieceIndex < arrLength && (lWriteBytes = write(arr[pieceIndex], wroteBytes)) > 0) {
            wroteBytes += lWriteBytes;
            pieceIndex++;
        }
        return target;
    }
    /**
    * Basic public split function
    */
    split(buf) {
        const reader = this.createReader(buf), pieces = [];
        for (let read = reader(); read !== false; read = reader())
            pieces.push(read);
        return pieces;
    }
    static createChunkReader(source, chunkLength) {
        const chunksTotal = Math.ceil(source.length / chunkLength), readChunk = (start, end) => {
            const bufLength = source.length, chunkStart = Math.max(0, Math.round(start)), chunkEnd = Math.max(chunkStart, Math.min(Math.round(end), bufLength));
            if (chunkStart > bufLength || chunkStart === chunkEnd)
                return false;
            return source.slice(chunkStart, chunkEnd);
        };
        let index = 0;
        return () => {
            const chunk = readChunk(index * chunkLength, (index + 1) * chunkLength);
            if (chunk)
                index++;
            return chunk;
        };
    }
    static createCopyWriter(target, targetOffset, totalToWrite) {
        const targetAvail = (target.byteLength - targetOffset);
        if (targetAvail < totalToWrite)
            throw new RangeError(`Target does not contain enough space (space required: ${totalToWrite}, available: ${targetAvail}).`);
        return (source, curOffset) => source.copy(target, targetOffset + curOffset, 0, source.length);
    }
}
exports.SplitAdapter = SplitAdapter;
;
/**
* Static module function to perform buffer split
*/
function split(adapter, buf) {
    return adapter.split(buf);
}
exports.split = split;
;
/**
* Static module function to perform buffer join
*/
function join(adapter, pieces, target) {
    return adapter.join(pieces, target);
}
exports.join = join;
;
//
// Split adapters
//
/**
* Adapter to split a buffer into a configurable amount of equal size pieces.
*/
class SplitEqualAmount extends SplitAdapter {
    constructor(amount = 1) {
        super();
        this.amount = amount;
    }
    createReader(source) {
        return SplitAdapter.createChunkReader(source, Math.ceil(source.length / Math.max(1, Math.round(this.amount))));
    }
    createWriter(target, targetOffset, totalToWrite) {
        return SplitAdapter.createCopyWriter(target, targetOffset, totalToWrite);
    }
}
exports.SplitEqualAmount = SplitEqualAmount;
;
/**
* Adapter to split a buffer into pieces with each piece having a configurable length.
*/
class SplitEqualLength extends SplitAdapter {
    constructor(length = 1) {
        super();
        this.length = length;
    }
    createReader(source) {
        return SplitAdapter.createChunkReader(source, Math.max(1, Math.round(this.length)));
    }
    createWriter(target, targetOffset, totalToWrite) {
        return SplitAdapter.createCopyWriter(target, targetOffset, totalToWrite);
    }
}
exports.SplitEqualLength = SplitEqualLength;
;
//# sourceMappingURL=buffer-split.js.map