import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import "../App.css";
const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [fromPageNo, setfromPageNo] = useState(null);
  const [toPageNo, settoPageNo] = useState(null);
  // Handle file selection
  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0];
      setPdfFile(file);

      // Generate a URL for the PDF preview
      const fileUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(fileUrl);
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
    const pageLength = pages.length;
    let pageNo = 1;
    // setfromPageNo(fromPageNo != null ? fromPageNo : pageNo);
    settoPageNo(toPageNo != null ? toPageNo : pageLength);
    setfromPageNo(
      fromPageNo != null
        ? fromPageNo > toPageNo
          ? toPageNo
          : fromPageNo + 1
        : pageNo
    );
    console.log("Total pages::", pageLength);
    // const pageno = pdfDoc.addPage([600, 400]);
    // Embed a font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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
      console.log("width::", width);
      console.log("headerTextWidth::", headerTextWidth);
      console.log("footerTextWidth::", footerTextWidth);

      const headerX = (width - headerTextWidth) / 2;
      console.log("headerX::", headerX);
      const footerX = (width - footerTextWidth) / 2;
      console.log("footerx::", footerX);

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
      // page.drawText(
      //   `Page ${fromPageNo != null ?fromPageNo : pageNo} / ${
      //     toPageNo!=null ? toPageNo : pageLength
      //   }`,

      page.drawText(
        `Page ${fromPageNo != null ? fromPageNo : pageNo} / ${
          toPageNo != null ? toPageNo : pageLength
        }`,
        {
          x: 510,
          y: 20,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        }
      );
      pageNo = pageNo + 1;
      // setfromPageNo(fromPageNo !=null ? fromPageNo > toPageNo ? toPageNo : fromPageNo+1 : pageNo);
      setHeaderText("");
      setFooterText("");
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

      {/*  add dynamic page no*/}
      <label>
        From:
        <input
          type="number"
          placeholder="Enter From Page No"
          value={fromPageNo}
          onChange={(e) => setfromPageNo(e.target.value)}
          style={{ marginLeft: "10px", marginRight: "20px" }}
        />
      </label>
      <label>
        To:
        <input
          type="number"
          placeholder="Enter From Page No"
          value={toPageNo}
          onChange={(e) => settoPageNo(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />
      <br />

      {/* Button to Modify and Download PDF */}
      <button
        onClick={() => modifyPDF()}
        disabled={!pdfFile || !headerText || !footerText}
        style={{ marginBottom: "20px" }}
      >
        Download Edited PDF
      </button>

      {/* Display PDF Preview */}
      {pdfPreviewUrl && (
        <div className="prev1">
          <h2 className="header-2">PDF Preview</h2>
          <iframe src={pdfPreviewUrl} className="iFrame" title="PDF Preview" />
        </div>
      )}
    </div>
  );
};

export default PDFEditor;
