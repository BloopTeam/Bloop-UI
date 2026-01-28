#!/bin/bash
set -e

# Install Rust if not already installed
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

# Install Trunk if not already installed
if ! command -v trunk &> /dev/null; then
    cargo install trunk --locked
fi

# Build the project
trunk build --release
