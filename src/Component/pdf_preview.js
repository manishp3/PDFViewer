import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { Worker, Viewer } from "@react-pdf-viewer/core"; // Import PDF Viewer
import "@react-pdf-viewer/core/lib/styles/index.css"; // Import default styles

const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState(null); // Store selected PDF file
  const [headerText, setHeaderText] = useState(""); // Header text input
  const [footerText, setFooterText] = useState(""); // Footer text input
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // PDF Preview URL

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);

    // Generate a URL for the PDF preview
    const fileUrl = URL.createObjectURL(file);
    setPdfPreviewUrl(fileUrl);
  };

  // Function to add header and footer to the PDF
  const modifyPDF = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file first.");
      return;
    }

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    // Embed a font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      // Calculate positions for header and footer text
      const headerFontSize = 12;
      const footerFontSize = 12;

      const headerTextWidth = font.widthOfTextAtSize(
        headerText,
        headerFontSize
      );
      const footerTextWidth = font.widthOfTextAtSize(
        footerText,
        footerFontSize
      );

      const headerX = (width - headerTextWidth) / 2;
      const footerX = (width - footerTextWidth) / 2;

      // Add header text
      page.drawText(headerText, {
        x: headerX,
        y: height - 30,
        size: headerFontSize,
        font: font,
        color: rgb(0, 0, 0),
      });

      // Add footer text
      page.drawText(footerText, {
        x: footerX,
        y: 20,
        size: footerFontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      setHeaderText("")
      setFooterText("")
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
      type: "application/pdf",
    });

    // Save the modified PDF
    saveAs(modifiedPdfBlob, "edited_document.pdf");

    // Update PDF preview
    const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
    setPdfPreviewUrl(modifiedPdfUrl);
  };

  return (
    <div style={{ padding: "20px" }}>
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
          placeholder="Enter Header Text"
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          style={{ marginLeft: "10px", marginRight: "20px" }}
        />
      </label>
      <label>
        Footer Text:
        <input  
          type="text"
          placeholder="Enter Footer Text"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />
      <br />

      {/* Button to Modify and Download PDF */}
      <button onClick={modifyPDF} disabled={!pdfFile}>
        Download Edited PDF
      </button>

      {/* Display PDF Preview */}
      {pdfPreviewUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>PDF Preview</h2>
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer fileUrl={pdfPreviewUrl} />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PDFEditor;
