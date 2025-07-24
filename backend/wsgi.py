#!/usr/bin/env python3
"""
WSGI Entry Point for DigitalOcean App Platform
Alego Manus V1.0
"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from app import app

# Configure for production
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
else:
    # For gunicorn
    application = app
