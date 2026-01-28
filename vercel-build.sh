#!/bin/bash
set -e

echo "Starting Rust/WASM build for Vercel..."

# Install Rust if not available
if ! command -v rustc &> /dev/null; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    export PATH="$HOME/.cargo/bin:$PATH"
    source "$HOME/.cargo/env" || true
fi

# Verify Rust installation
rustc --version || (echo "Rust installation failed" && exit 1)
cargo --version || (echo "Cargo not found" && exit 1)

# Install Trunk if not available
if ! command -v trunk &> /dev/null; then
    echo "Installing Trunk..."
    cargo install trunk --locked
fi

# Verify Trunk installation
trunk --version || (echo "Trunk installation failed" && exit 1)

# Build the project
echo "Building with Trunk..."
trunk build --release

echo "Build completed successfully!"
