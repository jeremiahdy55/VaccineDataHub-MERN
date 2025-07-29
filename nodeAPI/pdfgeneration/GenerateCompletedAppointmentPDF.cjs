const fs = require("fs");
const PdfPrinter = require("pdfmake");
export const generateCompletedAppointmentPDF = (appointment) => {
console.log({appointment})
}
// const fonts = {
//     Roboto: {
//       normal: __dirname + "/fonts/Roboto-Regular.ttf",
//       bold: __dirname + "/fonts/Roboto-Medium.ttf",
//       italics: __dirname + "/fonts/Roboto-Italic.ttf",
//       bolditalics: __dirname + "/fonts/Roboto-MediumItalic.ttf",
//     },
//   };

//   const printer = new PdfPrinter(fonts);

//   const { hospital, vaccine, approved, paid } = appointment;

//   const formatCurrency = (value) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(value || 0);

//   const total = (vaccine?.price || 0) + (hospital?.serviceCharge || 0);

//   // Get last 6 characters of patient id
//   let patientId = userObj?._id || "N/A";
//   patientId = "######-" + patientId.slice(-6);

//   const docDefinition = {
//     content: [
//       {
//         text: "Appointment Details",
//         style: "header",
//         alignment: "center",
//         margin: [0, 0, 0, 20],
//       },

//       {
//         text: `${vaccine?.name || "Unknown Vaccine"}\n[ ${vaccine?.abbreviation || "N/A"} ]`,
//         style: "subheader",
//         margin: [0, 0, 0, 10],
//       },

//       { text: "User Info", style: "sectionHeader" },
//       {
//         ul: [
//           `Patient ID: ${patientId}`,
//           `Name: ${userObj?.name || "N/A"}`,
//         ],
//         margin: [0, 0, 0, 10],
//       },

//       { text: "Hospital Info", style: "sectionHeader" },
//       {
//         ul: [
//           `Name: ${hospital?.name || "N/A"}`,
//           `Type: ${hospital?.type || "N/A"}`,
//           `Address: ${hospital?.address || "N/A"}`,
//         ],
//         margin: [0, 0, 0, 10],
//       },

//       { text: "Vaccine Info", style: "sectionHeader" },
//       {
//         ul: [
//           `Type: ${vaccine?.type || "N/A"}`,
//           `Origin: ${vaccine?.origin || "N/A"}`,
//           `Doses Required: ${vaccine?.dosesRequired ?? "N/A"}`,
//           `Strains Covered: ${vaccine?.info?.strainsCovered?.join(", ") || "N/A"}`,
//           `Common Side Effects: ${vaccine?.sideEffects?.join(", ") || "None listed"}`,
//         ],
//         margin: [0, 0, 0, 10],
//       },

//       { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },

//       { text: "Charges", style: "sectionHeader", margin: [0, 10, 0, 4] },
//       {
//         table: {
//           widths: ["*", "auto"],
//           body: [
//             ["Vaccine Price", formatCurrency(vaccine?.price)],
//             ["Service Charge", formatCurrency(hospital?.serviceCharge)],
//           ],
//         },
//         layout: "noBorders",
//         margin: [0, 0, 0, 10],
//       },

//       {
//         text: `Total: ${formatCurrency(total)}`,
//         style: "total",
//         alignment: "right",
//         margin: [0, 0, 0, 10],
//       },

//       {
//         text: approved
//           ? paid
//             ? ""
//             : "This appointment is approved but not yet paid."
//           : "This appointment is awaiting approval.",
//         color: approved ? (paid ? "green" : "blue") : "gray",
//         italics: true,
//         alignment: "left",
//         margin: [0, 10, 0, 0],
//       },
//     ],
//     styles: {
//       header: { fontSize: 20, bold: true },
//       subheader: { fontSize: 16, bold: true },
//       sectionHeader: { fontSize: 14, bold: true, color: "gray" },
//       total: { fontSize: 16, bold: true, color: "green" },
//     },
//   };

//   const pdfDoc = printer.createPdfKitDocument(docDefinition);

//   let chunks = [];
// pdfDoc.on("data", (chunk) => chunks.push(chunk));
// pdfDoc.on("end", () => {
//   const result = Buffer.concat(chunks);
//   console.log("✅ PDF created in memory. Size:", result.length, "bytes");

//   // Optionally: write to disk for quick preview
//   fs.writeFileSync("output.pdf", result);
// });

// pdfDoc.end();
// }