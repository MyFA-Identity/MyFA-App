# MyFA (My Friend Authenticator)

MyFA is a React Native & Expo-based mobile application that helps you prove that you’re really talking to the person you think you are. Similar to a TOTP (Time-Based One-Time Password) system, MyFA displays a shared “phrase” (made up of words) that changes periodically. When two users physically meet and exchange QR codes to set up a shared secret, both of their devices can later generate the same rotating phrase to confirm they share the same secret key.

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture](#architecture)  
4. [Installation](#installation)  
5. [Running the App](#running-the-app)  
6. [Usage Flow](#usage-flow)  
7. [Contributing](#contributing)  
8. [License](#license)

## Overview

**MyFA** (My Friend Authenticator) functions as a decentralized, local-only system for verifying person-to-person connections, without needing a server backend. When two people meet in person, one can generate a QR code containing a shared secret, and the other can scan it, thus syncing the secret on both devices. Both then use this secret to generate a rotating phrase, confirming identity over time.

## Features

1. **Local-Only Authentication**:  
   - No server or cloud storage. All data is kept on your device.

2. **QR Code Exchange**:  
   - Generate a QR code containing the shared secret.  
   - Use the device camera to scan another user’s QR code.

3. **Rotating Phrase Generation**:  
   - Similar to TOTP apps, but uses words or emojis instead of numeric codes.  
   - The phrase updates at a chosen interval (e.g., hourly).

4. **Secure Storage**:  
   - Utilizes [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/).

5. **No Passphrase Needed**:  
   - Simple and quick user flow (but keep in mind the QR code contains the secret in plaintext).

---

## Architecture

1. **React Native (Expo)**:  
   - Manages the UI and provides cross-platform compatibility (iOS, Android).

2. **Local Data Storage**:  
   - Stores contacts (name, secret, date added) locally using `expo-secure-store`.  

3. **QR Code Generation & Scanning**:  
   - Creates QR codes with the shared secret.  
   - Scans using [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) or an equivalent library.

4. **Time-Based Phrases**:  
   - Uses a custom HMAC-based function (similar to TOTP) from `services/crypto.ts`.  
   - Computes a unique code each interval, then maps it to words.

---
## Installation

1. **Install dependencies**:
   ```bash
   cd myfa
   npm install
   # or
   yarn install
   ```

2. **Install Expo CLI** (if you haven't already):
   ```bash
   npm install -g expo-cli
   ```

## Running the App

1. **Start the Expo development server**:
   ```bash
   npm run start
   ```

2. **Run on your device or simulator**:
   - iOS (Mac only): Press `i` in the terminal to launch iOS simulator
   - Android: Press `a` in the terminal to launch Android emulator, or scan the QR code in Expo Go

## Usage Flow

1. **Generate Contact**:
   - User A opens the "Generate Contact" screen, enters a name, and taps "Generate"
   - A QR code is displayed containing the shared secret and metadata

2. **Scan Contact**:
   - User B opens the "Scan Contact" screen, points the camera at User A's QR code
   - The shared secret is parsed and stored on User B's device

3. **Verify**:
   - Both devices generate a rotating phrase (or emojis) using the same secret
   - Comparing these phrases ensures you're talking to the correct person

## Contributing

	1.	Fork the repository.
	2.	Create a feature branch: git checkout -b feature/awesome-feature
	3.	Commit changes: git commit -m 'Add awesome feature'
	4.	Push to the branch: git push origin feature/awesome-feature
	5.	Create a Pull Request in GitHub.

## License

This project is licensed under the GNU Lesser General Public License v2.1 or later (LGPL-3.0-or-later). See the [LICENSE](LICENSE) file for details.

The LGPL is a permissive copyleft license that allows you to:
- Use the software for any purpose
- Modify the software
- Distribute the software
- Link with proprietary software

Key requirements:
- Include the original copyright notice
- Provide access to the source code
- License modifications under LGPL

Enjoy MyFA! If you have any questions or want to suggest improvements, feel free to open an issue or create a pull request.
