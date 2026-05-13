// pdf-print-server.js

const express = require("express");
const printer = require("pdf-to-printer");
const fs = require("fs");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 25123;

app.use(express.json());

// CORS + OPTIONS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

console.log("Starting POS PDF Print Server...");

// /status endpoint so browser can check if agent is running
app.get("/status", (req, res) => {
    res.json({ status: "running" });
});

// Download URL → temp PDF file using Node 18 global fetch
async function downloadPdfToTemp(url) {
    if (typeof fetch === "undefined") {
        throw new Error("Global fetch is not available in this runtime.");
    }

    console.log("Downloading PDF from URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download PDF. HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempFile = path.join(os.tmpdir(), `print_${Date.now()}.pdf`);
    await fs.promises.writeFile(tempFile, buffer);

    console.log("PDF downloaded to temp file:", tempFile);
    return tempFile;
}

// Main print endpoint
app.post("/print-pdf", async (req, res) => {
    const { path: inputPath } = req.body;

    if (!inputPath) {
        return res.status(400).json({
            status: "error",
            message: "No 'path' provided in request body",
        });
    }

    console.log("Received print request for:", inputPath);

    let localFilePath = inputPath;
    let tempFile = null;

    try {
        // If it's a URL, download it first
        if (/^https?:\/\//i.test(inputPath)) {
            tempFile = await downloadPdfToTemp(inputPath);
            localFilePath = tempFile;
        }

        // SumatraPDF.exe MUST be in the same folder as the EXE
        const sumatraPath = path.join(process.cwd(), "SumatraPDF.exe");
        console.log("Using Sumatra at:", sumatraPath);

        await printer.print(localFilePath, {
            sumatraPdfPath: sumatraPath, // important for pkg EXE
            // printer: undefined // default printer; specify name here if needed
        });

        console.log("Print job sent successfully.");
        res.json({ status: "sent" });
    } catch (err) {
        console.error("Error printing:", err);
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    } finally {
        if (tempFile) {
            fs.unlink(tempFile, (e) => {
                if (e) console.error("Error deleting temp file:", e);
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`PDF Print Agent running on http://127.0.0.1:${PORT}`);
});
