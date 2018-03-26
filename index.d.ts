/// <reference types="node" />
/**
* Reader interface for a split adapter.
*/
export interface ISplitAdapterReader<B extends Buffer = Buffer> {
    (): B | false;
}
/**
* Abstract adapter for splitting a B
*/
export declare abstract class SplitAdapter<B extends Buffer = Buffer> {
    /**
    * Reducer to use when concatenating a B to another B.
    */
    protected joinReducer(writeTo: B, piece: B, index: number): B;
    /**
    * Read a chunk from buffer within a defined range
    */
    protected readChunk(buffer: B, start: number, end: number): B | false;
    /**
    * Read the Nth chunk of a B with a configurable chunk size.
    */
    protected readChunkEqualLength(buffer: B, chunkLength: number, index?: number): B | false;
    /**
    * Abstract split a B function
    */
    abstract createReader(buf: B): ISplitAdapterReader<B>;
    /**
    * Basic public join function
    */
    join(pieces: B[], writeTo?: B): B;
    /**
    * Basic public split function
    */
    split(buf: B): B[];
}
/**
* Static module function to perform buffer split
*/
export declare function split<B extends Buffer = Buffer>(adapter: SplitAdapter<B>, buf: B): B[];
/**
* Static module function to perform buffer join
*/
export declare function join<B extends Buffer = Buffer>(adapter: SplitAdapter<B>, pieces: B[], writeTo?: B): B;
/**
* Adapter to split a buffer into a configurable amount of equal size pieces.
*/
export declare class SplitEqualAmount extends SplitAdapter {
    amount: number;
    constructor(amount?: number);
    createReader(buf: Buffer): ISplitAdapterReader;
}
/**
* Adapter to split a buffer into pieces with each piece having a configurable length.
*/
export declare class SplitEqualLength extends SplitAdapter {
    length: number;
    constructor(length?: number);
    createReader(buf: Buffer): ISplitAdapterReader;
}
