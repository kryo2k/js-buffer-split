import { Buffer } from 'buffer';

/**
* Reader interface for a split adapter.
*/
export interface ISplitAdapterReader <B extends Buffer = Buffer> {
  () : B|false;
};

/**
* Writer interface for a split adapter.
*/
export interface ISplitAdapterWriter <B extends Buffer = Buffer> {
  (source : B, targetOffset : number) : number;
};

/**
* Abstract adapter for splitting a B
*/
export abstract class SplitAdapter <B extends Buffer = Buffer> {

  /**
  * Abstract split a B function
  */
  abstract createReader (source: B) : ISplitAdapterReader<B>;

  /**
  * Abstract combine a B function
  */
  abstract createWriter (target: B, targetOffset : number, totalToWrite : number) : ISplitAdapterWriter<B>;

  /**
  * Compute the length of a single B.
  */
  protected getByteLength (b : B) : number {
    return b.byteLength;
  }

  /**
  * Compute the total length of an array of B.
  */
  protected totalByteLength (arr : B[], previousLength : number = 0) : number {
    return arr.reduce((p, c) => p + this.getByteLength(c), previousLength);
  }

  /**
  * Basic public join function
  */
  join (arr : B[], target ?: B, targetOffset : number = 0) : B {

    const
    arrLength     = arr.length,
    arrByteLength = this.totalByteLength(arr);

    if(typeof target === 'undefined')
      target = new Buffer(arrByteLength) as B;

    const write = this.createWriter(target, targetOffset, arrByteLength);
    let pieceIndex : number = 0, wroteBytes = 0, lWriteBytes : number;

    while(pieceIndex < arrLength && (lWriteBytes = write(arr[pieceIndex], wroteBytes)) > 0) {
      wroteBytes += lWriteBytes;
      pieceIndex++;
    }

    return target;
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

  static createChunkReader <B extends Buffer = Buffer>(source: B, chunkLength : number) : ISplitAdapterReader<B> {
    const
    chunksTotal = Math.ceil(source.length / chunkLength),
    readChunk = (start : number, end : number) : B|false => {

      const
      bufLength  = source.length,
      chunkStart = Math.max(0, Math.round(start)),
      chunkEnd   = Math.max(chunkStart, Math.min(Math.round(end), bufLength));

      if(chunkStart > bufLength || chunkStart === chunkEnd)
        return false;

      return source.slice(chunkStart, chunkEnd) as B;
    };

    let index = 0;

    return () : B|false => {
      const chunk = readChunk(index * chunkLength, (index+1) * chunkLength)
      if(chunk) index++
      return chunk;
    };
  }

  static createCopyWriter <B extends Buffer = Buffer>(target : B, targetOffset: number, totalToWrite : number) : ISplitAdapterWriter<B> {

    const targetAvail = (target.byteLength - targetOffset);

    if(targetAvail < totalToWrite)
      throw new RangeError(`Target does not contain enough space (space required: ${totalToWrite}, available: ${targetAvail}).`);

    return (source: B, curOffset : number) : number => source.copy(target, targetOffset + curOffset, 0, source.length);
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
export function join <B extends Buffer = Buffer>(adapter : SplitAdapter<B>, pieces: B[], target ?: B) : B {
  return adapter.join(pieces, target);
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

  createReader (source: Buffer) : ISplitAdapterReader {
    return SplitAdapter.createChunkReader(source, Math.ceil(source.length / Math.max(1, Math.round(this.amount))));
  }

  createWriter (target: Buffer, targetOffset : number, totalToWrite : number) : ISplitAdapterWriter {
    return SplitAdapter.createCopyWriter(target, targetOffset, totalToWrite);
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

  createReader (source: Buffer) : ISplitAdapterReader {
    return SplitAdapter.createChunkReader(source, Math.max(1, Math.round(this.length)));
  }

  createWriter (target : Buffer, targetOffset : number, totalToWrite : number) : ISplitAdapterWriter {
    return SplitAdapter.createCopyWriter(target, targetOffset, totalToWrite);
  }
};
