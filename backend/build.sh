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

# Install spaCy model directly via pip (more reliable than spacy download)
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl

