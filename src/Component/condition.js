//  // TODO: only download range pdf pages expect download entire pdf 
    
//     // TODO: refactor page filed empty when load new file
//     // TODO: addd restriction where user not able to take snapshot

//     // TODO: when directly downlod from and empty to it corrrect but after some process when perfrom same opeeration it count 1 less page and show one extra page
//     // when page is 1 and give start range show 1/0

// if(HFPosition==1){
//     page.drawText(headerText, {
//       x: 20,
//       y: 815,
//       size: headerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });
  
//     // Add footer text
//     page.drawText(footerText, {
//       x: 20,
//       y: 20,
//       size: footerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });
//   }
//   // Add header text right
//   else if(HFPosition==3){
//     page.drawText(headerText, {
//       x: 530,
//       y: 815,
//       size: headerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });
  
//     // Add footer text
//     page.drawText(footerText, {
//       x: 530,
//       y: 20,
//       size: footerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });
//   }
//   // cneter page
//   else{
//   page.drawText(headerText, {
//     x: headerX,
//     y: height - 30,
//     size: headerFontSize,
//     font: font,
//     color: rgb(0, 0, 0),
//   });

//   // Add footer text
//   page.drawText(footerText, {
//     x: footerX,
//     y: 20,
//     size: footerFontSize,
//     font: font,
//     color: rgb(0, 0, 0),
//   });
//   }

// //   dynamic centere
//  // cneter page
//  else {
//     console.log("else called::", HFPosition);
//     page.drawText(headerText, {
//       x: headerX,
//       y: height - 30,
//       size: headerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });

//     // Add footer text
//     page.drawText(footerText, {
//       x: footerX,
//       y: footerY,
//       size: footerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });
//   }

// //   page right dynamic 
//  // Add header text right
//  else if (HFPosition == 3) {
//     console.log("(height-footerY)-7::", height - footerY - 7);
//     page.drawText(headerText, {
//       x: headerX * 2 - 37,
//       y: height - footerY - 7,
//       // y: 815,
//       size: headerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });

//     // Add footer text
//     // TODO::
//     page.drawText(footerText, {
//       x: headerX * 2 - 37,
//       y: footerY,
//       // y: 20,
//       size: footerFontSize,
//       font: font,
//       color: rgb(0, 0, 0),
//     });

const modifyPDF = async () => {
    if (!pdfFile) {
        alert("Please select a PDF file first.");
        return;
    }
    
    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const totalPageCount = pages.length;

    const fromPage = fromPageNo ? parseInt(fromPageNo) : 1;
    let toPage = toPageNo ? parseInt(toPageNo) : totalPageCount;

    // Validate page range
    if (fromPage < 1 || toPage > totalPageCount || fromPage > toPage) {
        alert("Invalid page range.");
        return;
    }

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();
    const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);

    let count = 1;
    let range = (toPageNo ? toPage : totalPageCount) - (fromPageNo ? fromPage : 0);
    
    // Add pages within the specified range to the new PDF document
    for (let i = fromPage - 1; i < toPage; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);
    }

    // Add headers, footers, and page numbers to the new document
    const newPages = newPdfDoc.getPages();
    newPages.forEach((page, index) => {
        const pageIndex = index + fromPage;
        const { width, height } = page.getSize();
        const headerFontSize = 12;
        const footerFontSize = 12;
        const headerTextWidth = font.widthOfTextAtSize(headerText, headerFontSize);
        const footerTextWidth = font.widthOfTextAtSize(footerText, footerFontSize);

        const headerX = (width - headerTextWidth) / 2;
        const footerX = (width - footerTextWidth) / 2;
        const headerMarginTop = 30;
        const footerMarginBottom = 20;
        const headerY = height - headerMarginTop;
        const footerY = footerMarginBottom;

        if (HFPosition == 1) {
            page.drawText(headerText, {
                x: footerY,
                y: height - 30,
                size: headerFontSize,
                font: font,
                color: rgb(0, 0, 0),
            });

            page.drawText(footerText, {
                x: footerY,
                y: footerY,
                size: footerFontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
        } else if (HFPosition == 3) {
            page.drawText(headerText, {
                x: headerX * 2 - 37,
                y: height - footerY - 7,
                size: headerFontSize,
                font: font,
                color: rgb(0, 0, 0),
            });

            page.drawText(footerText, {
                x: headerX * 2 - 37,
                y: footerY,
                size: footerFontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
        } else {
            page.drawText(headerText, {
                x: headerX,
                y: height - 30,
                size: headerFontSize,
                font: font,
                color: rgb(0, 0, 0),
            });

            page.drawText(footerText, {
                x: footerX,
                y: footerY,
                size: footerFontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
        }

        const pageCountText = `Page ${count++} / ${range + 1}`;
        if (HFPosition != 3) {
            page.drawText(pageCountText, {
                x: headerX * 2 - 42,
                y: footerY - 10,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
            });
        } else {
            page.drawText(pageCountText, {
                x: footerX,
                y: footerY - 10,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
            });
        }
    });

    const modifiedPdfBytes = await newPdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
    });

    // Save the modified PDF with the original file name
    const originalFilename = pdfFile.name || "document.pdf";
    const downloadFilename = `${originalFilename.replace('.pdf', '_modified.pdf')}`;
    saveAs(modifiedPdfBlob, downloadFilename);

    // Update PDF preview
    const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
    setPdfPreviewUrl(modifiedPdfUrl);
};
