# Mini cURL

Mini cURL is a lightweight **command-line HTTP client** written in Python. It is inspired by the basic functionality of `curl` and is designed as a learning project for understanding HTTP requests, responses, headers, authentication, redirects, and data transmission.

The project is implemented using only the **Python Standard Library**, mainly `urllib.request`, without external HTTP libraries such as `requests` or `httpx`.

---

## Features

Mini cURL supports several commonly used HTTP client features:

- GET requests
- POST requests
- PUT requests
- PATCH requests
- DELETE requests
- HEAD requests
- Custom HTTP methods
- Custom request headers
- Request body data
- JSON requests
- URL-encoded form data
- File downloading
- Response header display
- HTTP redirects
- Redirect limits
- Request timeout
- Custom User-Agent
- HTTP Basic Authentication
- Verbose mode
- Silent mode
- Request status and response time information

---

## Requirements

- Python 3.10 or later

No additional Python packages are required.

You do **not** need to install libraries such as:

```bash
pip install requests
```

The program uses only Python's built-in libraries.

---

## Project Structure

```text
mini-curl/
│
├── mini_curl.py
└── README.md
```

### `mini_curl.py`

The main program responsible for:

- Parsing command-line arguments
- Creating HTTP requests
- Sending request headers
- Sending request bodies
- Handling JSON data
- Handling authentication
- Processing HTTP redirects
- Reading HTTP responses
- Downloading files
- Handling network and HTTP errors

### `README.md`

Documentation for installing and using Mini cURL.

---

## Getting Started

Clone or download the project and enter the project directory:

```bash
cd mini-curl
```

Check your Python version:

```bash
python --version
```

Run Mini cURL:

```bash
python mini_curl.py https://httpbin.org/get
```

---

# Usage

The basic command format is:

```bash
python mini_curl.py [OPTIONS] URL
```

For example:

```bash
python mini_curl.py https://httpbin.org/get
```

If no HTTP method is specified, Mini cURL sends a `GET` request by default.

---

# Examples

## 1. GET Request

Send a simple GET request:

```bash
python mini_curl.py https://httpbin.org/get
```

Equivalent cURL command:

```bash
curl https://httpbin.org/get
```

---

## 2. Specify an HTTP Method

Use `-X` or `--request` to specify the HTTP method.

```bash
python mini_curl.py -X DELETE https://httpbin.org/delete
```

For a PUT request:

```bash
python mini_curl.py -X PUT -d "Hello World" https://httpbin.org/put
```

Equivalent cURL command:

```bash
curl -X PUT -d "Hello World" https://httpbin.org/put
```

---

## 3. POST Request

Use `-d` or `--data` to send request body data.

```bash
python mini_curl.py -d "name=Erika&major=CSIE" https://httpbin.org/post
```

If data is provided without specifying `-X`, Mini cURL automatically uses the `POST` method.

Equivalent cURL command:

```bash
curl -d "name=Erika&major=CSIE" https://httpbin.org/post
```

---

## 4. Send JSON Data

Use `--json` to send JSON data.

### Windows

```bash
python mini_curl.py --json "{\"name\":\"Erika\",\"major\":\"CSIE\"}" https://httpbin.org/post
```

### Linux / macOS

```bash
python mini_curl.py --json '{"name":"Erika","major":"CSIE"}' https://httpbin.org/post
```

Mini cURL automatically adds:

```text
Content-Type: application/json
```

---

## 5. Custom Headers

Use `-H` or `--header` to add a request header.

```bash
python mini_curl.py -H "Accept: application/json" https://httpbin.org/headers
```

Multiple headers can also be added:

```bash
python mini_curl.py \
-H "Accept: application/json" \
-H "X-Test: Hello" \
https://httpbin.org/headers
```

Equivalent cURL command:

```bash
curl \
-H "Accept: application/json" \
-H "X-Test: Hello" \
https://httpbin.org/headers
```

---

## 6. URL-Encoded Form Data

Use `--data-urlencode` to send URL-encoded form data.

```bash
python mini_curl.py \
--data-urlencode "name=Erika Lie" \
--data-urlencode "school=NQU" \
https://httpbin.org/post
```

The request will use:

```text
Content-Type: application/x-www-form-urlencoded
```

---

## 7. Display Response Headers

Use `-i` or `--include` to display the response headers together with the response body.

```bash
python mini_curl.py -i https://httpbin.org/get
```

Example output:

```text
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 256

{
    ...
}
```

---

## 8. HEAD Request

Use `-I` or `--head` to send a HEAD request.

```bash
python mini_curl.py -I https://example.com
```

A HEAD request retrieves only the HTTP headers without downloading the response body.

Equivalent cURL command:

```bash
curl -I https://example.com
```

---

## 9. Follow Redirects

Use `-L` or `--location` to follow HTTP redirects.

```bash
python mini_curl.py -L https://httpbin.org/redirect/2
```

The maximum number of redirects can also be specified:

```bash
python mini_curl.py -L --max-redirs 5 https://httpbin.org/redirect/2
```

Equivalent cURL command:

```bash
curl -L https://httpbin.org/redirect/2
```

---

## 10. Download a File

Use `-o` or `--output` to save the response body to a file.

```bash
python mini_curl.py -o image.png https://httpbin.org/image/png
```

The downloaded content will be saved as:

```text
image.png
```

Equivalent cURL command:

```bash
curl -o image.png https://httpbin.org/image/png
```

---

## 11. Request Timeout

Use `--connect-timeout` to specify a timeout.

```bash
python mini_curl.py --connect-timeout 5 https://httpbin.org/get
```

In this example, the timeout is set to five seconds.

---

## 12. Custom User-Agent

Use `-A` or `--user-agent` to specify a custom User-Agent.

```bash
python mini_curl.py -A "MiniCurl/1.0" https://httpbin.org/user-agent
```

Equivalent cURL command:

```bash
curl -A "MiniCurl/1.0" https://httpbin.org/user-agent
```

---

## 13. Basic Authentication

Mini cURL supports HTTP Basic Authentication using `-u` or `--user`.

```bash
python mini_curl.py -u username:password https://httpbin.org/basic-auth/username/password
```

The program converts the credentials into a Base64 encoded Authorization header:

```text
Authorization: Basic <encoded-credentials>
```

Equivalent cURL command:

```bash
curl -u username:password https://httpbin.org/basic-auth/username/password
```

---

## 14. Verbose Mode

Use `-v` or `--verbose` to display additional request and response information.

```bash
python mini_curl.py -v https://httpbin.org/get
```

Verbose mode displays information such as:

```text
> GET /get HTTP/1.1
> Host: httpbin.org
> User-Agent: mini-curl/1.0

< HTTP 200 OK
< Content-Type: application/json
< Content-Length: ...
```

This feature is useful for debugging HTTP requests.

---

## 15. Transfer Information

Use `-w` or `--write-out` to display basic transfer information.

```bash
python mini_curl.py -w https://httpbin.org/get
```

Example:

```text
status=200 bytes=320 time=0.542s redirects=0
```

This provides information about:

- HTTP status code
- Response size
- Request duration
- Number of redirects

---

# Command-Line Options

| Option | Description |
|---|---|
| `-X`, `--request` | Specify HTTP method |
| `-H`, `--header` | Add a custom HTTP header |
| `-d`, `--data` | Send request body data |
| `--json` | Send JSON data |
| `--data-urlencode` | Send URL-encoded form data |
| `-o`, `--output` | Save response to a file |
| `-I`, `--head` | Send a HEAD request |
| `-i`, `--include` | Include response headers |
| `-L`, `--location` | Follow HTTP redirects |
| `--max-redirs` | Set maximum redirect count |
| `--connect-timeout` | Set request timeout |
| `-A`, `--user-agent` | Set a custom User-Agent |
| `-u`, `--user` | HTTP Basic Authentication |
| `-v`, `--verbose` | Display detailed HTTP information |
| `-s`, `--silent` | Suppress status messages |
| `-w`, `--write-out` | Display transfer information |

---

# How It Works

The program follows the basic HTTP client workflow:

```text
Command Line
     │
     ▼
Parse Arguments
     │
     ▼
Build HTTP Request
     │
     ├── Method
     ├── URL
     ├── Headers
     ├── Authentication
     └── Request Body
     │
     ▼
Send HTTP Request
     │
     ▼
Receive HTTP Response
     │
     ├── Status Code
     ├── Headers
     └── Response Body
     │
     ▼
Process Response
     │
     ├── Print to Terminal
     └── Save to File
```

The `urllib.request` module is responsible for creating and sending HTTP requests.

`argparse` is used to provide a command-line interface similar to cURL.

---

# Error Handling

Mini cURL handles several common errors, including:

### HTTP Errors

Examples:

```text
404 Not Found
401 Unauthorized
403 Forbidden
500 Internal Server Error
```

### Network Errors

For example:

```text
mini-curl: request failed: Connection refused
```

### Timeout

For example:

```text
mini-curl: request timed out
```

### Invalid Headers

For example:

```text
mini-curl: Invalid header. Expected 'Name: Value'.
```

### Invalid JSON

For example:

```text
mini-curl: Invalid JSON
```

---

# Technologies Used

### Python

The project is written entirely in Python.

### urllib.request

Used for creating and sending HTTP requests.

### urllib.parse

Used for URL parsing and URL-encoded form data.

### argparse

Used to build the command-line interface.

### json

Used to process JSON request bodies.

### base64

Used to implement HTTP Basic Authentication.

---

# Learning Objectives

The main purpose of this project is to understand how command-line HTTP clients such as cURL work.

Through this project, the following concepts can be practiced:

- HTTP request and response structure
- HTTP methods
- HTTP headers
- HTTP status codes
- Request bodies
- JSON APIs
- Form encoding
- HTTP authentication
- HTTP redirects
- Network timeout handling
- Command-line argument parsing
- File downloading
- Error handling

Instead of relying on a high-level HTTP library, Mini cURL uses Python's standard networking tools to provide a clearer understanding of the HTTP request process.

---

# Limitations

Mini cURL is an educational project and is not intended to completely replace the real cURL tool.

Some advanced cURL features are not currently supported, including:

- HTTP/2
- HTTP/3
- FTP
- SFTP
- Proxy configuration
- Cookie storage
- Multipart file upload
- Client certificates
- Advanced TLS configuration
- SOCKS proxy
- Parallel downloads

These features could be added in future versions.

---

# Future Improvements

Possible future improvements include:

- Cookie support
- Multipart file uploads
- Proxy support
- Download progress bar
- Colored terminal output
- Request history
- Configuration files
- Retry mechanism
- SSL/TLS options
- API response formatting
- Concurrent requests

---

## Example

A complete POST request with JSON data, a custom header, verbose output, and transfer information:

```bash
python mini_curl.py \
-X POST \
-H "Accept: application/json" \
--json '{"name":"Erika","school":"National Quemoy University"}' \
-v \
-w \
https://httpbin.org/post
```

This demonstrates how Mini cURL can be used as a lightweight command-line HTTP client for testing web APIs.

---

## License

This project is created for educational and learning purposes.

## Author

Developed as a Python networking and HTTP client practice project.
