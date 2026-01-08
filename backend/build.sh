#!/bin/bash
set -e

# Install system dependencies required for building spacy
apt-get update && apt-get install -y \
    python3-dev \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, and wheel
pip install --upgrade pip setuptools wheel

# Install Python dependencies
pip install -r requirements.txt

