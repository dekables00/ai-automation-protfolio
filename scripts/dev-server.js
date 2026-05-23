const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function getFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.resolve(rootDir, relativePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    return path.join(filePath, "index.html");
  }

  if (!path.extname(filePath) && fs.existsSync(`${filePath}.html`)) {
    return `${filePath}.html`;
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = getFilePath(request.url);

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(data);
  });
});

function getNetworkUrls() {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses || []) {
      if (address.family === "IPv4" && !address.internal) {
        urls.push(`http://${address.address}:${port}`);
      }
    }
  }

  return urls;
}

server.listen(port, host, () => {
  console.log(`Portfolio preview running locally at http://127.0.0.1:${port}`);
  console.log(`Listening on ${host}:${port}`);

  for (const url of getNetworkUrls()) {
    console.log(`Network preview: ${url}`);
  }
});
