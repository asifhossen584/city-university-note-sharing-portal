// lib/pdf.js - makes a small one-page PDF. Used only for the sample notes.
// (Ported unchanged from the original portal, lib/pdf.js.)
function clean(text) {
  return String(text).replace(/[^\x20-\x7E]/g, '?').replace(/[\\()]/g, '\\$&');
}

function makePdf(title, subtitle, lines) {
  var content = 'BT /F2 24 Tf 60 750 Td (' + clean(title) + ') Tj ET\n';
  content += 'BT /F1 13 Tf 60 722 Td (' + clean(subtitle) + ') Tj ET\n';
  for (var i = 0; i < lines.length; i++) {
    content += 'BT /F1 16 Tf 80 ' + (660 - i * 46) + ' Td (- ' + clean(lines[i]) + ') Tj ET\n';
  }
  content += 'BT /F1 10 Tf 60 40 Td (Sample note created for the demo) Tj ET\n';

  var objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
    '<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
  ];

  var pdf = '%PDF-1.4\n';
  var offsets = [];
  for (var j = 0; j < objects.length; j++) {
    offsets.push(pdf.length);
    pdf += (j + 1) + ' 0 obj\n' + objects[j] + '\nendobj\n';
  }
  var xref = pdf.length;
  pdf += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
  for (var k = 0; k < offsets.length; k++) {
    pdf += String(offsets[k]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  return Buffer.from(pdf, 'latin1');
}

module.exports = { makePdf };
