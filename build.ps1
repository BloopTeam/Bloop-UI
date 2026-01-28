# PowerShell build script for Windows/Vercel

# Check if Rust is installed
if (-not (Get-Command rustc -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Rust..."
    Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"
    & "$env:TEMP\rustup-init.exe" -y
    $env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
}

# Check if Trunk is installed
if (-not (Get-Command trunk -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Trunk..."
    cargo install trunk --locked
}

# Build the project
trunk build --release
