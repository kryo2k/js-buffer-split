/// <reference types="node" />
/**
* Reader interface for a split adapter.
*/
export interface ISplitAdapterReader<B extends Buffer = Buffer> {
    (): B | false;
}
/**
* Writer interface for a split adapter.
*/
export interface ISplitAdapterWriter<B extends Buffer = Buffer> {
    (source: B, targetOffset: number): number;
}
/**
* Abstract adapter for splitting a B
*/
export declare abstract class SplitAdapter<B extends Buffer = Buffer> {
    /**
    * Abstract split a B function
    */
    abstract createReader(source: B): ISplitAdapterReader<B>;
    /**
    * Abstract combine a B function
    */
    abstract createWriter(target: B, targetOffset: number, totalToWrite: number): ISplitAdapterWriter<B>;
    /**
    * Compute the length of a single B.
    */
    protected getByteLength(b: B): number;
    /**
    * Compute the total length of an array of B.
    */
    protected totalByteLength(arr: B[], previousLength?: number): number;
    /**
    * Basic public join function
    */
    join(arr: B[], target?: B, targetOffset?: number): B;
    /**
    * Basic public split function
    */
    split(buf: B): B[];
    static createChunkReader<B extends Buffer = Buffer>(source: B, chunkLength: number): ISplitAdapterReader<B>;
    static createCopyWriter<B extends Buffer = Buffer>(target: B, targetOffset: number, totalToWrite: number): ISplitAdapterWriter<B>;
}
/**
* Static module function to perform buffer split
*/
export declare function split<B extends Buffer = Buffer>(adapter: SplitAdapter<B>, buf: B): B[];
/**
* Static module function to perform buffer join
*/
export declare function join<B extends Buffer = Buffer>(adapter: SplitAdapter<B>, pieces: B[], target?: B): B;
/**
* Adapter to split a buffer into a configurable amount of equal size pieces.
*/
export declare class SplitEqualAmount extends SplitAdapter {
    amount: number;
    constructor(amount?: number);
    createReader(source: Buffer): ISplitAdapterReader;
    createWriter(target: Buffer, targetOffset: number, totalToWrite: number): ISplitAdapterWriter;
}
/**
* Adapter to split a buffer into pieces with each piece having a configurable length.
*/
export declare class SplitEqualLength extends SplitAdapter {
    length: number;
    constructor(length?: number);
    createReader(source: Buffer): ISplitAdapterReader;
    createWriter(target: Buffer, targetOffset: number, totalToWrite: number): ISplitAdapterWriter;
}
