"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
;
/**
* Abstract adapter for splitting a B
*/
class SplitAdapter {
    /**
    * Reducer to use when concatenating a B to another B.
    */
    joinReducer(writeTo, piece, index) {
        return buffer_1.Buffer.concat([writeTo, piece]);
    }
    /**
    * Read a chunk from buffer within a defined range
    */
    readChunk(buffer, start, end) {
        const bufLength = buffer.length, chunkStart = Math.max(0, Math.round(start)), chunkEnd = Math.max(chunkStart, Math.min(Math.round(end), bufLength));
        if (chunkStart > bufLength || chunkStart === chunkEnd)
            return false;
        return buffer.slice(chunkStart, chunkEnd);
    }
    /**
    * Read the Nth chunk of a B with a configurable chunk size.
    */
    readChunkEqualLength(buffer, chunkLength, index = 0) {
        return this.readChunk(buffer, index * chunkLength, (index + 1) * chunkLength);
    }
    /**
    * Basic public join function
    */
    join(pieces, writeTo = buffer_1.Buffer.allocUnsafe(0)) {
        return pieces.reduce(this.joinReducer.bind(this), writeTo);
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
function join(adapter, pieces, writeTo) {
    return adapter.join(pieces, writeTo);
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
    createReader(buf) {
        const chunkLength = Math.ceil(buf.length / Math.max(1, Math.round(this.amount)));
        let index = 0;
        return () => {
            const chunk = this.readChunkEqualLength(buf, chunkLength, index);
            if (chunk)
                index++;
            return chunk;
        };
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
    createReader(buf) {
        const chunkLength = Math.max(1, Math.round(this.length));
        let index = 0;
        return () => {
            const chunk = this.readChunkEqualLength(buf, chunkLength, index);
            if (chunk)
                index++;
            return chunk;
        };
    }
}
exports.SplitEqualLength = SplitEqualLength;
;
//# sourceMappingURL=buffer-split.js.map