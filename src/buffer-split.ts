import { Buffer } from 'buffer';

/**
* Reader interface for a split adapter.
*/
export interface ISplitAdapterReader <B extends Buffer = Buffer> {
  () : B|false;
};

/**
* Abstract adapter for splitting a B
*/
export abstract class SplitAdapter <B extends Buffer = Buffer> {

  /**
  * Reducer to use when concatenating a B to another B.
  */

  protected joinReducer(writeTo : B, piece : B, index : number) : B {
    return Buffer.concat([writeTo, piece]) as B;
  }

  /**
  * Read a chunk from buffer within a defined range
  */
  protected readChunk (buffer : B, start : number, end : number) : B|false {

    const
    bufLength  = buffer.length,
    chunkStart = Math.max(0, Math.round(start)),
    chunkEnd   = Math.max(chunkStart, Math.min(Math.round(end), bufLength));

    if(chunkStart > bufLength || chunkStart === chunkEnd)
      return false;

    return buffer.slice(chunkStart, chunkEnd) as B;
  }

  /**
  * Read the Nth chunk of a B with a configurable chunk size.
  */
  protected readChunkEqualLength (buffer : B, chunkLength : number, index : number = 0) : B|false {
    return this.readChunk(buffer, index * chunkLength, (index+1) * chunkLength);
  }

  /**
  * Abstract split a B function
  */
  abstract createReader (buf: B) : ISplitAdapterReader<B>;

  /**
  * Basic public join function
  */
  join (pieces : B[], writeTo : B = Buffer.allocUnsafe(0) as B) : B {
    return pieces.reduce(this.joinReducer.bind(this), writeTo);
  }

  /**
  * Basic public split function
  */
  split (buf : B) : B[] {

    const
    reader = this.createReader(buf),
    pieces : B[] = [];

    for(let read : B|false = reader(); read !== false; read = reader())
      pieces.push(read);

    return pieces;
  }
};

/**
* Static module function to perform buffer split
*/
export function split <B extends Buffer = Buffer>(adapter : SplitAdapter<B>, buf : B) : B[] {
  return adapter.split(buf);
};


/**
* Static module function to perform buffer join
*/
export function join <B extends Buffer = Buffer>(adapter : SplitAdapter<B>, pieces: B[], writeTo ?: B) : B {
  return adapter.join(pieces, writeTo);
};

//
// Split adapters
//

/**
* Adapter to split a buffer into a configurable amount of equal size pieces.
*/
export class SplitEqualAmount extends SplitAdapter {
  amount : number;

  constructor (amount : number = 1) {
    super();
    this.amount = amount;
  }

  createReader (buf: Buffer) : ISplitAdapterReader {
    const chunkLength = Math.ceil(buf.length / Math.max(1, Math.round(this.amount)));
    let   index     = 0;

    return () => {
      const chunk = this.readChunkEqualLength(buf, chunkLength, index);
      if(chunk) index++
      return chunk;
    }
  }
};

/**
* Adapter to split a buffer into pieces with each piece having a configurable length.
*/
export class SplitEqualLength extends SplitAdapter {
  length : number;

  constructor (length : number = 1) {
    super();
    this.length = length;
  }

  createReader (buf: Buffer) : ISplitAdapterReader {
    const chunkLength = Math.max(1, Math.round(this.length));
    let   index     = 0;

    return () => {
      const chunk = this.readChunkEqualLength(buf, chunkLength, index);
      if(chunk) index++
      return chunk;
    }
  }
};
