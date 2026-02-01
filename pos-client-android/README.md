# POS Client (Sandbox) - Build Instructions

## Overview
This is the Reference Implementation of the "World Physical Acceptance Layer" POS.
It is a Native Android application built with Kotlin and Jetpack Compose.

## Prerequisites
-   Android Studio Koala or newer
-   JDK 17
-   Android SDK API 34

## Build & Run (Mock Mode)
Since we are in Sandbox mode, the app is pre-configured to talk to the local Orchestrator.

1.  **Configure Backend URL:**
    Open `app/src/main/java/com/worldphysical/pos/data/PaymentRepository.kt`
    Ensure `BaseURL` points to your computer's IP (e.g. `http://10.0.2.2:8080` for Android Emulator).

2.  **Build APK:**
    ```bash
    ./gradlew assembleDebug
    ```
    Output: `app/build/outputs/apk/debug/app-debug.apk`

3.  **Run on Device:**
    Enable USB Debugging and run within Android Studio.

## Simulated Flow
1.  **Enter Amount:** Type `5.50`
2.  **Hit "Charge":** The app calls `POST /api/v1/payment_intents`
3.  **Screen shows QR:** Checks status via polling.
4.  **Trigger Payment:** (Manually trigger the mock webhook via `curl` or the simulation script)
5.  **Success:** Screen updates to "Payment Settled".
