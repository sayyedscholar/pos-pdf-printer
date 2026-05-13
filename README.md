# POS PDF Printer

A Node.js-based PDF print server that allows printing PDF files via HTTP API. This server uses SumatraPDF as the PDF viewer and printer backend.

## Features

- RESTful API for printing PDF files
- Support for both local file paths and remote URLs
- CORS-enabled for browser-based applications
- Status endpoint to check if server is running
- Automatic cleanup of temporary downloaded files

## Requirements

- Node.js 18+ (for global fetch support)
- Windows OS (SumatraPDF is Windows-only)
- SumatraPDF.exe (must be in the same directory as the server)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure `SumatraPDF.exe` is in the project directory

## Usage

### Start the server

```bash
node pdf-print-server.js
```

The server will start on `http://127.0.0.1:25123`

### API Endpoints

#### GET /status
Check if the server is running.

**Response:**
```json
{
  "status": "running"
}
```

#### POST /print-pdf
Print a PDF file.

**Request Body:**
```json
{
  "path": "path/to/file.pdf"  // Local file path or HTTP/HTTPS URL
}
```

**Response (Success):**
```json
{
  "status": "sent"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Error message"
}
```

### Example Usage

```bash
# Print a local file
curl -X POST http://127.0.0.1:25123/print-pdf \
  -H "Content-Type: application/json" \
  -d "{\"path\": \"C:\\path\\to\\file.pdf\"}"

# Print from URL
curl -X POST http://127.0.0.1:25123/print-pdf \
  -H "Content-Type: application/json" \
  -d "{\"path\": \"https://example.com/document.pdf\"}"
```

## Building as Executable

To build as a standalone executable using pkg:

```bash
npm install -g pkg
pkg pdf-print-server.js
```

The resulting `pos-pdf-printer.exe` can be distributed without requiring Node.js installation.

## Windows Launcher

The `launch.vbs` script can be used to start the server silently on Windows. It checks if the process is already running before launching.

## License

ISC
