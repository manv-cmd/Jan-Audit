#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Installing dependencies..."
pip install -r requirements.txt
echo ""
echo "Starting JAN Audit API at http://127.0.0.1:8000"
echo "API docs: http://127.0.0.1:8000/docs"
echo ""
uvicorn main:app --reload --host 127.0.0.1 --port 8000
