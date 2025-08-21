import { PdfPipe } from './pdf.pipe';

describe('PdfPipe', () => {
  it('create an instance', () => {
    const pipe = new PdfPipe();
    expect(pipe).toBeTruthy();
  });
});
