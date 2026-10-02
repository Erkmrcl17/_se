import argparse
import base64
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


class RedirectHandler(urllib.request.HTTPRedirectHandler):
    """
    Controls whether redirects are followed.
    """

    def __init__(self, follow_redirects=False, max_redirects=10):
        super().__init__()
        self.follow_redirects = follow_redirects
        self.max_redirects = max_redirects
        self.redirect_count = 0

    def redirect_request(
        self,
        req,
        fp,
        code,
        msg,
        headers,
        newurl
    ):
        if not self.follow_redirects:
            return None

        self.redirect_count += 1

        if self.redirect_count > self.max_redirects:
            raise urllib.error.HTTPError(
                req.full_url,
                code,
                "Maximum redirects exceeded",
                headers,
                fp
            )

        return super().redirect_request(
            req,
            fp,
            code,
            msg,
            headers,
            newurl
        )


def parse_headers(header_list):
    """
    Convert command-line headers into a dictionary.

    Example:
        ["Accept: application/json", "X-Test: Hello"]

    becomes:
        {
            "Accept": "application/json",
            "X-Test": "Hello"
        }
    """

    headers = {}

    for header in header_list:
        if ":" not in header:
            raise ValueError(
                f"Invalid header '{header}'. "
                "Expected format: 'Name: Value'"
            )

        name, value = header.split(":", 1)

        name = name.strip()
        value = value.strip()

        if not name:
            raise ValueError("Header name cannot be empty.")

        headers[name] = value

    return headers


def build_request_body(args):
    """
    Build request body based on command-line options.
    """

    # JSON data
    if args.json_data is not None:
        try:
            parsed_json = json.loads(args.json_data)
        except json.JSONDecodeError as error:
            raise ValueError(
                f"Invalid JSON: {error}"
            )

        body = json.dumps(parsed_json).encode("utf-8")

        return body, "application/json"

    # Normal text data
    if args.data is not None:
        return args.data.encode("utf-8"), None

    # URL encoded form data
    if args.data_urlencode:
        form_data = []

        for item in args.data_urlencode:
            if "=" in item:
                key, value = item.split("=", 1)
                form_data.append((key, value))
            else:
                form_data.append(("", item))

        encoded_data = urllib.parse.urlencode(
            form_data
        ).encode("utf-8")

        return (
            encoded_data,
            "application/x-www-form-urlencoded"
        )

    return None, None


def decode_response(data, content_type):
    """
    Decode response body using charset from Content-Type.
    """

    charset = "utf-8"

    if content_type:
        parts = content_type.split(";")

        for part in parts[1:]:
            part = part.strip()

            if part.lower().startswith("charset="):
                charset = part.split("=", 1)[1].strip()
                charset = charset.strip('"')

    try:
        return data.decode(charset)

    except (UnicodeDecodeError, LookupError):
        return data.decode(
            "utf-8",
            errors="replace"
        )


def print_headers(response):
    """
    Print HTTP response headers.
    """

    status = getattr(
        response,
        "status",
        response.getcode()
    )

    reason = getattr(
        response,
        "reason",
        ""
    )

    print(
        f"HTTP {status} {reason}"
    )

    for key, value in response.headers.items():
        print(
            f"{key}: {value}"
        )

    print()


def print_verbose_request(request, body):
    """
    Display request information similar to curl -v.
    """

    parsed_url = urllib.parse.urlsplit(
        request.full_url
    )

    path = parsed_url.path or "/"

    if parsed_url.query:
        path += "?" + parsed_url.query

    print(
        f"> {request.get_method()} "
        f"{path} HTTP/1.1",
        file=sys.stderr
    )

    print(
        f"> Host: {parsed_url.netloc}",
        file=sys.stderr
    )

    for key, value in request.header_items():
        print(
            f"> {key}: {value}",
            file=sys.stderr
        )

    if body is not None:
        print(
            f"> Content-Length: {len(body)}",
            file=sys.stderr
        )

    print(">", file=sys.stderr)


def print_verbose_response(response):
    """
    Display response information similar to curl -v.
    """

    status = getattr(
        response,
        "status",
        response.getcode()
    )

    reason = getattr(
        response,
        "reason",
        ""
    )

    print(
        f"< HTTP {status} {reason}",
        file=sys.stderr
    )

    for key, value in response.headers.items():
        print(
            f"< {key}: {value}",
            file=sys.stderr
        )

    print("<", file=sys.stderr)


def create_parser():
    """
    Create command-line argument parser.
    """

    parser = argparse.ArgumentParser(
        prog="mini-curl",
        description=(
            "A lightweight curl-like "
            "HTTP command-line client."
        )
    )

    # URL
    parser.add_argument(
        "url",
        help="Target URL"
    )

    # HTTP method
    parser.add_argument(
        "-X",
        "--request",
        dest="method",
        help=(
            "Specify HTTP method "
            "(GET, POST, PUT, DELETE, etc.)"
        )
    )

    # Headers
    parser.add_argument(
        "-H",
        "--header",
        action="append",
        default=[],
        help=(
            "Add request header. "
            "Example: 'Accept: application/json'"
        )
    )

    # Data
    parser.add_argument(
        "-d",
        "--data",
        help="Send request body data"
    )

    # JSON
    parser.add_argument(
        "--json",
        dest="json_data",
        help="Send JSON request body"
    )

    # URL encoded data
    parser.add_argument(
        "--data-urlencode",
        action="append",
        default=[],
        help="Send URL-encoded form data"
    )

    # Output file
    parser.add_argument(
        "-o",
        "--output",
        help="Save response body to file"
    )

    # HEAD request
    parser.add_argument(
        "-I",
        "--head",
        action="store_true",
        help="Send HEAD request"
    )

    # Include headers
    parser.add_argument(
        "-i",
        "--include",
        action="store_true",
        help="Include response headers"
    )

    # Follow redirects
    parser.add_argument(
        "-L",
        "--location",
        action="store_true",
        help="Follow redirects"
    )

    # Max redirects
    parser.add_argument(
        "--max-redirs",
        type=int,
        default=10,
        help="Maximum number of redirects"
    )

    # Timeout
    parser.add_argument(
        "--connect-timeout",
        type=float,
        default=30.0,
        help="Request timeout in seconds"
    )

    # User Agent
    parser.add_argument(
        "-A",
        "--user-agent",
        help="Set custom User-Agent"
    )

    # Basic Auth
    parser.add_argument(
        "-u",
        "--user",
        help="HTTP Basic Auth username:password"
    )

    # Verbose
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Display detailed request information"
    )

    # Silent
    parser.add_argument(
        "-s",
        "--silent",
        action="store_true",
        help="Suppress status messages"
    )

    # Write-out
    parser.add_argument(
        "-w",
        "--write-out",
        action="store_true",
        help="Display transfer information"
    )

    return parser


def main():
    parser = create_parser()

    args = parser.parse_args()

    # Validate timeout
    if args.connect_timeout <= 0:
        parser.error(
            "--connect-timeout must be greater than 0"
        )

    # Validate redirects
    if args.max_redirs < 0:
        parser.error(
            "--max-redirs must be 0 or greater"
        )

    try:
        headers = parse_headers(
            args.header
        )

        body, content_type = build_request_body(
            args
        )

    except ValueError as error:
        print(
            f"mini-curl: {error}",
            file=sys.stderr
        )

        return 2

    # Automatically add Content-Type
    if content_type:
        has_content_type = any(
            key.lower() == "content-type"
            for key in headers
        )

        if not has_content_type:
            headers["Content-Type"] = content_type

    # User-Agent
    if args.user_agent:
        headers["User-Agent"] = args.user_agent

    elif not any(
        key.lower() == "user-agent"
        for key in headers
    ):
        headers["User-Agent"] = "mini-curl/1.0"

    # Basic Authentication
    if args.user:
        if ":" not in args.user:
            print(
                "mini-curl: --user must use "
                "username:password format",
                file=sys.stderr
            )

            return 2

        encoded_credentials = base64.b64encode(
            args.user.encode("utf-8")
        ).decode("ascii")

        headers["Authorization"] = (
            f"Basic {encoded_credentials}"
        )

    # Determine HTTP method
    if args.head:
        method = "HEAD"
        body = None

    elif args.method:
        method = args.method.upper()

    elif body is not None:
        method = "POST"

    else:
        method = "GET"

    # Create request
    request = urllib.request.Request(
        args.url,
        data=body,
        headers=headers,
        method=method
    )

    # Redirect handler
    redirect_handler = RedirectHandler(
        follow_redirects=args.location,
        max_redirects=args.max_redirs
    )

    opener = urllib.request.build_opener(
        redirect_handler
    )

    # Verbose request
    if args.verbose:
        print_verbose_request(
            request,
            body
        )

    start_time = time.perf_counter()

    try:
        response = opener.open(
            request,
            timeout=args.connect_timeout
        )

        response_data = response.read()

        elapsed_time = (
            time.perf_counter()
            - start_time
        )

        # Verbose response
        if args.verbose:
            print_verbose_response(
                response
            )

        # Include response headers
        if args.include and not args.output:
            print_headers(
                response
            )

        # HEAD request
        if args.head:
            if not args.include:
                print_headers(
                    response
                )

        # Save to file
        elif args.output:
            with open(
                args.output,
                "wb"
            ) as file:
                file.write(
                    response_data
                )

            if not args.silent:
                print(
                    f"Saved {len(response_data)} "
                    f"bytes to {args.output}",
                    file=sys.stderr
                )

        # Print response body
        else:
            content_type_header = (
                response.headers.get(
                    "Content-Type"
                )
            )

            text = decode_response(
                response_data,
                content_type_header
            )

            sys.stdout.write(text)

            if (
                text
                and not text.endswith("\n")
            ):
                sys.stdout.write("\n")

        # Transfer information
        if (
            args.write_out
            and not args.silent
        ):
            print(
                (
                    f"\nstatus={response.getcode()} "
                    f"bytes={len(response_data)} "
                    f"time={elapsed_time:.3f}s "
                    f"redirects="
                    f"{redirect_handler.redirect_count}"
                ),
                file=sys.stderr
            )

        return 0

    # HTTP Error
    except urllib.error.HTTPError as error:
        elapsed_time = (
            time.perf_counter()
            - start_time
        )

        response_data = (
            error.read()
            if error.fp
            else b""
        )

        if args.verbose:
            print(
                f"< HTTP {error.code} "
                f"{error.reason}",
                file=sys.stderr
            )

            if error.headers:
                for key, value in error.headers.items():
                    print(
                        f"< {key}: {value}",
                        file=sys.stderr
                    )

        if response_data and not args.head:
            content_type_header = None

            if error.headers:
                content_type_header = (
                    error.headers.get(
                        "Content-Type"
                    )
                )

            text = decode_response(
                response_data,
                content_type_header
            )

            sys.stdout.write(text)

            if (
                text
                and not text.endswith("\n")
            ):
                sys.stdout.write("\n")

        if not args.silent:
            print(
                (
                    f"mini-curl: HTTP error "
                    f"{error.code}: "
                    f"{error.reason}"
                ),
                file=sys.stderr
            )

            if args.write_out:
                print(
                    (
                        f"status={error.code} "
                        f"bytes={len(response_data)} "
                        f"time={elapsed_time:.3f}s"
                    ),
                    file=sys.stderr
                )

        return 22

    # Network Error
    except urllib.error.URLError as error:
        if not args.silent:
            print(
                (
                    "mini-curl: request failed: "
                    f"{error.reason}"
                ),
                file=sys.stderr
            )

        return 7

    # Timeout
    except TimeoutError:
        if not args.silent:
            print(
                "mini-curl: request timed out",
                file=sys.stderr
            )

        return 28

    except KeyboardInterrupt:
        if not args.silent:
            print(
                "\nmini-curl: interrupted",
                file=sys.stderr
            )

        return 130


if __name__ == "__main__":
    raise SystemExit(
        main()
    )
