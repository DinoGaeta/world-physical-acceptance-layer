# POS Client (Sandbox) - Dev Server Config

## Connecting to Real Dev Server

To connect the Android POS Client to your deployed Go Orchestrator (on Digital Ocean, AWS, or local network):

### 1. Update Base URL
Open `app/src/main/java/com/worldphysical/pos/data/PaymentRepository.kt`.
Find the `BaseURL` constant and update it to your deployed endpoint.

**Example (Local Network):**
```kotlin
// Replace 10.0.2.2 with your computer's local IP (e.g., 192.168.1.50) if testing on physical device
private const val BaseURL = "http://192.168.1.50:8080" 
```

**Example (Cloud Sandbox):**
```kotlin
private const val BaseURL = "https://sandbox-api.worldphysical.io"
```

### 2. Build for Dev
Run the build command again:
```bash
./gradlew clean assembleDebug
```

### 3. Verify Connection
Inside the app, initiate a payment. If the Orchestrator is reachable, you will see a QR code generated immediately.
If you see "Init failed: timeout", check firewall rules on port 8080.
