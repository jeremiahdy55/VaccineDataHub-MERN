// import fs from "fs"; // used for local debugging
import PdfPrinter from "pdfmake";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { uploadToS3 } from "./S3BucketAccess.js";

export const generateCompletedAppointmentPDF = (appointment) => {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // construct the pdf using the hospital, vaccine, user, and date data
    // connect to s3 and send it over
    const fonts = {
      Roboto: {
        normal: __dirname + "/fonts/Roboto-Regular.ttf",
        bold: __dirname + "/fonts/Roboto-Medium.ttf",
        italics: __dirname + "/fonts/Roboto-Italic.ttf",
        bolditalics: __dirname + "/fonts/Roboto-MediumItalic.ttf",
      },
    };

    // Create new printer with the fonts available
    const printer = new PdfPrinter(fonts);

    // Destructure appointment
    const {
      hospitalId: hospital,
      vaccineId: vaccine,
      userId: userObj,
      approved,
      paid,
    } = appointment;

    // simple currency formatter for US dollar
    const formatCurrency = (value) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value || 0);

    // get total service charge
    const total = (vaccine?.price || 0) + (hospital?.serviceCharge || 0);

    // Get last 6 characters of patient id
    let patientId = userObj?._id.toString() || "N/A";
    patientId = "######-" + patientId.slice(-6);

    // create the PDF as "instructions" for the writer
    const docDefinition = {
      content: [
        {
          text: "Appointment Details",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        {
          text: `${vaccine?.name || "Unknown Vaccine"}\n[ ${
            vaccine?.abbreviation || "N/A"
          } ]`,
          style: "subheader",
          margin: [0, 0, 0, 10],
        },

        { text: "User Info", style: "sectionHeader" },
        {
          ul: [`Patient ID: ${patientId}`, `Name: ${userObj?.name || "N/A"}`],
          margin: [0, 0, 0, 10],
        },

        { text: "Hospital Info", style: "sectionHeader" },
        {
          ul: [
            `Name: ${hospital?.name || "N/A"}`,
            `Type: ${hospital?.type || "N/A"}`,
            `Address: ${hospital?.address || "N/A"}`,
          ],
          margin: [0, 0, 0, 10],
        },

        { text: "Vaccine Info", style: "sectionHeader" },
        {
          ul: [
            `Type: ${vaccine?.type || "N/A"}`,
            `Origin: ${vaccine?.origin || "N/A"}`,
            `Doses Required: ${vaccine?.dosesRequired ?? "N/A"}`,
            `Strains Covered: ${
              vaccine?.info?.strainsCovered?.join(", ") || "N/A"
            }`,
            `Common Side Effects: ${
              vaccine?.sideEffects?.join(", ") || "None listed"
            }`,
          ],
          margin: [0, 0, 0, 10],
        },

        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
        },

        { text: "Charges", style: "sectionHeader", margin: [0, 10, 0, 4] },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Vaccine Price", formatCurrency(vaccine?.price)],
              ["Service Charge", formatCurrency(hospital?.serviceCharge)],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 10],
        },

        {
          text: `Total: ${formatCurrency(total)}`,
          style: "total",
          alignment: "right",
          margin: [0, 0, 0, 10],
        },

        {
          text: approved
            ? paid
              ? ""
              : "This appointment is approved but not yet paid."
            : "This appointment is awaiting approval.",
          color: approved ? (paid ? "green" : "blue") : "gray",
          italics: true,
          alignment: "left",
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true },
        subheader: { fontSize: 16, bold: true },
        sectionHeader: { fontSize: 14, bold: true, color: "gray" },
        total: { fontSize: 16, bold: true, color: "green" },
      },
    };

    // create the pdf as chunks
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", async () => {
      // construct the whole pdf as a blob
      const result = Buffer.concat(chunks);

      // console.log("PDF created in memory. Size:", result.length, "bytes");

      // declare filename
      const filename = `appointment-${appointment._id.toString()}.pdf`;

      // try access the s3 bucket declared in .env and put the appointment pdf there
      try {
        await uploadToS3(result, filename);
        console.log(`Successfully uploaded ${filename} to S3`);
        resolve(filename);
      } catch (err) {
        console.error("Couldn't upload to S3 bucket defined in .env", err);
        reject(err);
      }

      // Optionally: write to disk for quick preview and debug
      // fs.writeFileSync(__dirname + "/output.pdf", result);
    });

    pdfDoc.end();
  });
};
