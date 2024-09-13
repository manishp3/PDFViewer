import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState(null); // Store selected PDF file
  const [headerText, setHeaderText] = useState(''); // Header text input
  const [footerText, setFooterText] = useState(''); // Footer text input

  // Handle file selection
  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  // Function to add header and footer to the PDF
  const modifyPDF = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file first.');
      return;
    }

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const { width, height } = pages[0].getSize();

    pages.forEach((page) => {
      // Add header text
      page.drawText(headerText, {
        x:300,
        y: height - 30,
        size: 12,
        color: rgb(0, 0, 0),
      });

      // Add footer text
      page.drawText(footerText, {
        x: 300,
        y: 20,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    // Save the modified PDF
    saveAs(modifiedPdfBlob, 'edited_document.pdf');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PDF Header and Footer Editor</h1>

      {/* File Input for Selecting PDF */}
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <br />
      <br />

      {/* Inputs for Header and Footer Text */}
      <label>
        Header Text:
        <input
          type="text"
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          style={{ marginLeft: '10px', marginRight: '20px' }}
        />
      </label>
      <label>
        Footer Text:
        <input
          type="text"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </label>
      <br />
      <br />

      {/* Button to Modify and Download PDF */}
      <button onClick={modifyPDF} disabled={!pdfFile}>
        Download Edited PDF
      </button>
    </div>
  );
};

export default PDFEditor;