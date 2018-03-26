import { Buffer } from 'buffer';
import { ISplitAdapterReader, ISplitAdapterWriter, SplitAdapter, SplitEqualAmount, SplitEqualLength, split, join } from './buffer-split';
import { expect } from 'chai';
import 'mocha';

describe('BufferSplit', () => {

  const
  testBuffer = new Buffer([ 0, 1, 2, 3, 4 ]);

  describe('Abstract SplitAdapter', () => {

    class TestSplitAdapterReaderWasCalled extends SplitAdapter<Buffer> {
      called : boolean = false;

      createReader (buf: Buffer) : ISplitAdapterReader {
        return () => {
          if(!this.called) this.called = true;
          return false;
        };
      }

      createWriter() : ISplitAdapterWriter {
        return () => 0;
      }
    }

    class TestSplitAdapterWriterWasCalled extends SplitAdapter<Buffer> {
      called : boolean = false;

      createReader (buf: Buffer) : ISplitAdapterReader {
        return () => false;
      }

      createWriter(target : Buffer, targetOffset: number, totalToWrite : number) : ISplitAdapterWriter {
        return () : number => {
          if(!this.called) this.called = true;
          return 0;
        };
      }
    }

    it('should call reader when doing a split', () => {
      const adapter = new TestSplitAdapterReaderWasCalled();
      expect(adapter.called).to.eq(false);
      split(adapter, Buffer.allocUnsafe(0));
      expect(adapter.called).to.eq(true);
    });

    it('should call writer when doing a join', () => {
      const adapter = new TestSplitAdapterWriterWasCalled();
      expect(adapter.called).to.eq(false);
      join(adapter, [testBuffer]);
      expect(adapter.called).to.eq(true);
    });

    it('should NOT call writer when doing an empty join', () => {
      const adapter = new TestSplitAdapterWriterWasCalled();
      expect(adapter.called).to.eq(false);
      join(adapter, []);
      expect(adapter.called).to.eq(false);
    });
  });

  describe('EqualAmount SplitAdapter', () => {
    it('should be able to join what it splits', () => {
      const adapter = new SplitEqualAmount(5); // split test buffer into 5 pieces (1 byte long)

      const s = split(adapter, testBuffer);

      expect(s.length).to.eq(5);
      expect(s[0][0]).to.eq(0);
      expect(s[1][0]).to.eq(1);
      expect(s[2][0]).to.eq(2);
      expect(s[3][0]).to.eq(3);
      expect(s[4][0]).to.eq(4);

      const
      w = Buffer.allocUnsafe(testBuffer.byteLength),
      j = join(adapter, s, w);

      expect(w).to.deep.eq(testBuffer);
      expect(j).to.eq(w);
    });
  });

  describe('EqualLength SplitAdapter', () => {
    it('should be able to join what it splits', () => {
      const adapter = new SplitEqualLength(1); // split test buffer into 5 pieces (1 byte long)

      const s = split(adapter, testBuffer);

      expect(s.length).to.eq(5);
      expect(s[0][0]).to.eq(0);
      expect(s[1][0]).to.eq(1);
      expect(s[2][0]).to.eq(2);
      expect(s[3][0]).to.eq(3);
      expect(s[4][0]).to.eq(4);

      const
      w = Buffer.allocUnsafe(testBuffer.byteLength),
      j = join(adapter, s, w);

      expect(w).to.deep.eq(testBuffer);
      expect(j).to.eq(w);
    });
  });
});
