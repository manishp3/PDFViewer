import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import "../App.css";

const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [fromPageNo, setFromPageNo] = useState(null);
  const [toPageNo, setToPageNo] = useState(null);
  const [totalPageCount, setTotalPageCount] = useState(0); // State for total pages

  // Handle file selection
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      setPdfFile(file);

      // Generate a URL for the PDF preview
      const fileUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(fileUrl);

      // Load the PDF to get the total page count
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      setTotalPageCount(pages.length); // Set the total number of pages
    } catch (error) {
      console.log("Error during file selection:", error);
    }
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
    const totalPageCount = pages.length; // No need to update state again

    // Set default values for From and To page numbers if not provided
    const fromPage = fromPageNo ? parseInt(fromPageNo) : 1;
    const toPage = toPageNo ? parseInt(toPageNo) : totalPageCount;

    // Validate page range
    if (fromPage < 1 || toPage > totalPageCount || fromPage > toPage) {
      alert("Invalid page range.");
      return;
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page, index) => {
      const pageIndex = index + 1;

      // Only apply modifications to pages within the specified range
      if (pageIndex >= fromPage && pageIndex <= toPage) {
        const { width, height } = page.getSize();
        const headerFontSize = 12;
        const footerFontSize = 12;
        const headerTextWidth = font.widthOfTextAtSize(headerText, headerFontSize);
        const footerTextWidth = font.widthOfTextAtSize(footerText, footerFontSize);

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

        // Add Page No
        page.drawText(`Page ${pageIndex} / ${totalPageCount}`, {
          x: 510,
          y: 20,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });

    // Save the modified PDF
    saveAs(modifiedPdfBlob, "edited_document.pdf");

    // Update PDF preview
    const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
    setPdfPreviewUrl(modifiedPdfUrl);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PDF Header and Footer Editor</h1>

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

      {/* Inputs for Page Range */}
      <label>
        From:
        <input
          type="number"
          placeholder="Enter From Page No"
          value={fromPageNo || ""}
          onChange={(e) => setFromPageNo(e.target.value)}
          style={{ marginLeft: "10px", marginRight: "20px" }}
        />
      </label>
      <label>
        To:
        <input
          type="number"
          placeholder="Enter To Page No"
          value={toPageNo || ""}
          onChange={(e) => setToPageNo(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />
      <br />

      {/* Display Total Pages */}
      <div>
        <label>
          Total Pages:
          <h3>{totalPageCount}</h3>
        </label>
      </div>

      {/* Button to Modify and Download PDF */}
      <button
        onClick={modifyPDF}
        disabled={!pdfFile || !headerText || !footerText}
        style={{ marginBottom: "20px" }}
      >
        Download Edited PDF
      </button>

      {/* Display PDF Preview */}
      {pdfPreviewUrl && (
        <div className="prev1">
          <h2 className="header-2">PDF Preview</h2>
          {/* Disable download and print options */}
          <iframe src={pdfPreviewUrl + "#toolbar=0"} className="iFrame" title="PDF Preview" />
        </div>
      )}
    </div>
  );
};

export default PDFEditor;
