"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const buffer_split_1 = require("./buffer-split");
const chai_1 = require("chai");
require("mocha");
describe('BufferSplit', () => {
    const testBuffer = new buffer_1.Buffer([0, 1, 2, 3, 4]);
    describe('Abstract SplitAdapter', () => {
        class TestSplitAdapterReaderWasCalled extends buffer_split_1.SplitAdapter {
            constructor() {
                super(...arguments);
                this.called = false;
            }
            createReader(buf) {
                return () => {
                    if (!this.called)
                        this.called = true;
                    return false;
                };
            }
            createWriter() {
                return () => 0;
            }
        }
        class TestSplitAdapterWriterWasCalled extends buffer_split_1.SplitAdapter {
            constructor() {
                super(...arguments);
                this.called = false;
            }
            createReader(buf) {
                return () => false;
            }
            createWriter(target, targetOffset, totalToWrite) {
                return () => {
                    if (!this.called)
                        this.called = true;
                    return 0;
                };
            }
        }
        it('should call reader when doing a split', () => {
            const adapter = new TestSplitAdapterReaderWasCalled();
            chai_1.expect(adapter.called).to.eq(false);
            buffer_split_1.split(adapter, buffer_1.Buffer.allocUnsafe(0));
            chai_1.expect(adapter.called).to.eq(true);
        });
        it('should call writer when doing a join', () => {
            const adapter = new TestSplitAdapterWriterWasCalled();
            chai_1.expect(adapter.called).to.eq(false);
            buffer_split_1.join(adapter, [testBuffer]);
            chai_1.expect(adapter.called).to.eq(true);
        });
        it('should NOT call writer when doing an empty join', () => {
            const adapter = new TestSplitAdapterWriterWasCalled();
            chai_1.expect(adapter.called).to.eq(false);
            buffer_split_1.join(adapter, []);
            chai_1.expect(adapter.called).to.eq(false);
        });
    });
    describe('EqualAmount SplitAdapter', () => {
        it('should be able to join what it splits', () => {
            const adapter = new buffer_split_1.SplitEqualAmount(5); // split test buffer into 5 pieces (1 byte long)
            const s = buffer_split_1.split(adapter, testBuffer);
            chai_1.expect(s.length).to.eq(5);
            chai_1.expect(s[0][0]).to.eq(0);
            chai_1.expect(s[1][0]).to.eq(1);
            chai_1.expect(s[2][0]).to.eq(2);
            chai_1.expect(s[3][0]).to.eq(3);
            chai_1.expect(s[4][0]).to.eq(4);
            const w = buffer_1.Buffer.allocUnsafe(testBuffer.byteLength), j = buffer_split_1.join(adapter, s, w);
            chai_1.expect(w).to.deep.eq(testBuffer);
            chai_1.expect(j).to.eq(w);
        });
    });
    describe('EqualLength SplitAdapter', () => {
        it('should be able to join what it splits', () => {
            const adapter = new buffer_split_1.SplitEqualLength(1); // split test buffer into 5 pieces (1 byte long)
            const s = buffer_split_1.split(adapter, testBuffer);
            chai_1.expect(s.length).to.eq(5);
            chai_1.expect(s[0][0]).to.eq(0);
            chai_1.expect(s[1][0]).to.eq(1);
            chai_1.expect(s[2][0]).to.eq(2);
            chai_1.expect(s[3][0]).to.eq(3);
            chai_1.expect(s[4][0]).to.eq(4);
            const w = buffer_1.Buffer.allocUnsafe(testBuffer.byteLength), j = buffer_split_1.join(adapter, s, w);
            chai_1.expect(w).to.deep.eq(testBuffer);
            chai_1.expect(j).to.eq(w);
        });
    });
});
//# sourceMappingURL=buffer-split.spec.js.map