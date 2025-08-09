import http.server
import socketserver
import os

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Serve files from dist-minimal directory
os.chdir('dist-minimal')

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Ultra-fast website serving at http://localhost:{PORT}")
    httpd.serve_forever()