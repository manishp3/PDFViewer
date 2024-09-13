// only specified pdf download baki
// TODO: only download range pdf pages expect download entire pdf 
    
    // TODO: refactor page filed empty when load new file
    // TODO: addd restriction where user not able to take snapshot

    // TODO: when directly downlod from and empty to it corrrect but after some process when perfrom same opeeration it count 1 less page and show one extra page
    // when page is 1 and give start range show 1/0

    import React, { useEffect, useState } from "react";
    import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
    import { saveAs } from "file-saver";
    import "../App.css";
    
    const PDFEditor = () => {
      const [pdfFile, setPdfFile] = useState(null);
      // empty default value
      const [headerText, setHeaderText] = useState("Header");
      const [footerText, setFooterText] = useState("Footer");
      const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
      const [fromPageNo, setFromPageNo] = useState(null);
      const [toPageNo, setToPageNo] = useState(null);
      const [totalPageCount, settotalPageCount] = useState(0);
      const [HFPosition, setHFPosition] = useState(2);
    
      // Handle file selection
      
      const handleFileChange = async (e) => {    
        try {
          const file = e.target.files[0];
          setPdfFile(file);
    
          // Generate a URL for the PDF preview
          const fileUrl = URL.createObjectURL(file);
          
          setPdfPreviewUrl(fileUrl);
          const existingPdfBytes = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const pages = pdfDoc.getPages();
          settotalPageCount(pages.length);
          
        } catch (error) {
          console.log("Error during file selection:", error);
        }
      };
    
      // Function to add header and footer to the PDF
      
      const modifyPDF = async () => {
        
        // console.log("HFPosition::",HFPosition);
        if (!pdfFile) {
          alert("Please select a PDF file first.");
          return;
        }
        console.log("pdfFile::",pdfFile);
        const existingPdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const totalPageCount = pages.length;
    
        // Set default values for From and To page numbers if not provided
    
        // if(fromPageNo!=null && toPageNo==null){
        //   setToPageNo(totalPageCount)
        //   console.log("topageno is null and clalled :: and count vlaue ::",totalPageCount);
        // }
    
        const fromPage = fromPageNo ? parseInt(fromPageNo) : 1;
        let toPage = toPageNo ? parseInt(toPageNo) : totalPageCount;
        // Validate page range
        if (fromPage < 1 || toPage > totalPageCount || fromPage > toPage) {
          alert("Invalid page range.");
          return;
        }
    
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
        let count = 1;
        console.log("toPageNo::", toPageNo);
        console.log("fromPageNo::", fromPageNo);
    
        
        let range =
          (toPageNo ? toPage : totalPageCount) - (fromPageNo ? fromPage : 0) ;
        console.log("Range::", range);
    
        pages.forEach((page, index) => {
          console.log("check for value::");
          const pageIndex = index + 1;
    
          // Only apply modifications to pages within the specified range
          let main = 1;
          if (pageIndex >= fromPage && pageIndex <= toPage) {
            console.log("main::", main);
            main = main + 1;
            const { width, height } = page.getSize();
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
    
            // console.log("height :: width ::",{height,width});
            const headerX = (width - headerTextWidth) / 2;
            const footerX = (width - footerTextWidth) / 2;
            // Dynamically calculate vertical positions (Y) based on page height
            const headerMarginTop = 30; // Distance from the top edge
            const footerMarginBottom = 20; // Distance from the bottom edge
            const headerY = height - headerMarginTop; // Calculating Y for the header
            const footerY = footerMarginBottom; // Calculating Y for the footer
            console.log(
              "header X :: footer X:: () header Y :: footer Y:: () height :: width ::",
              headerX,
              footerX,
              headerY,
              footerY,
              { height, width }
            );
            // Add header text left
            console.log(
              "(((headerX+footerX)-footerY)*3)+2",
              (headerX + footerX - footerY) * 3 + 2
            );
            if (HFPosition == 1) {
              console.log("left called ::", HFPosition);
              page.drawText(headerText, {
                x: footerY,
                y: height - 30,
                size: headerFontSize,
                font: font,
                color: rgb(0, 0, 0),
              });
    
              // Add footer text
              page.drawText(footerText, {
                x: footerY,
                y: footerY,
                size: footerFontSize,
                font: font,
                color: rgb(0, 0, 0),
              });
            }
            // Add header text right
            else if (HFPosition == 3) {
              console.log("(height-footerY)-7::", height - footerY - 7);
              page.drawText(headerText, {
                x: headerX * 2 - 37,
                y: height - footerY - 7,
                // y: 815,
                size: headerFontSize,
                font: font,
                color: rgb(0, 0, 0),
              });
    
              // Add footer text
              
              page.drawText(footerText, {
                x: headerX * 2 - 37,
                y: footerY,
                // y: 20,
                size: footerFontSize,
                font: font,
                color: rgb(0, 0, 0),
              });
            }
            // cneter page
            else {
              console.log("else called::", HFPosition);
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
                y: footerY,
                size: footerFontSize,
                font: font,
                color: rgb(0, 0, 0),
              });
            }
            // Add Page No
            console.log("toPageNo:: toPage ::", toPageNo, toPage);
            console.log("fromPageNo:: fromPage ::", fromPageNo, fromPage);
            console.log("totalPageCount::", totalPageCount);
            // range=totalPageCount;
            if(fromPageNo!=null && toPageNo==null ){
              if(fromPageNo==1){
                setToPageNo(totalPageCount)
              range=totalPageCount;
              }else{
              range=totalPageCount-fromPageNo+1;
              }
              
            }
            if (HFPosition != 3) {
              console.log("Count First::", count);
              console.log("Range::", range);
               
              // TODO: check page condition now its okay but understand
                page.drawText(
                  `Page ${fromPageNo ? count++ : pageIndex} / ${
                    fromPageNo && toPageNo ? range + 1 : range
                  }`,{
              // page.drawText(`Page ${fromPageNo ? count++ : pageIndex+1} / ${range}`, {
                x: headerX*2-42,
                y: footerY-10,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
              });
            } else {
              page.drawText(
                `Page ${fromPageNo ? count++ : pageIndex} / ${
                  fromPageNo && toPageNo ? range + 1 : range
                }`,
                {
                  x: footerX,
                  // y: 20,
                  y: footerY-10,
                  size: 12,
                  font: font,
                  color: rgb(0, 0, 0),
                }
              );
            }
          }    
          
        });
    
        const modifiedPdfBytes = await pdfDoc.save();
        const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
          type: "application/pdf",
        });
    
        // Save the modified PDF
        saveAs(modifiedPdfBlob, `${pdfFile.name}`);
        console.log("name of saved file ::",pdfFile.name);
    
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
    
          {/* Header & Footer Position  */}
          <label>
            Header & Footer Position :
            <select
              defaultValue={HFPosition}
              onChange={(e) => setHFPosition(e.target.value)}
            >
              <option value="1">Left</option>
              <option value="2">Center</option>
              <option value="3">Right</option>
            </select>
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
    
          <label>
            <h3>Pages: {totalPageCount}</h3>
          </label>
          <br />
          {/* <br />*/}
    
          {/* Button to Modify and Download PDF */}
          <button
            onClick={modifyPDF}
            disabled={!pdfFile}
            style={{ marginBottom: "20px" }}
          >
            Download Edited PDF
          </button>
    
          {/* Display PDF Preview */}
          {pdfPreviewUrl && (
            <div className="prev1">
              <h2 className="header-2">PDF Preview</h2>
              {/* disable dowblaod and print option */}
              <iframe
                src={pdfPreviewUrl + "#toolbar=0"}
                className="iFrame"
                title="PDF Preview"
              />
            </div>
          )}
        </div>
      );
    };
    
    export default PDFEditor;
    