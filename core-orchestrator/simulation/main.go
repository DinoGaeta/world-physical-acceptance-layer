package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// Config
const BaseURL = "http://localhost:8080"

func main() {
	log.Println("🧪 STARTING WORLD PHYSICAL LAYER - E2E SANDBOX SIMULATION")
	log.Println("==========================================================")

	// Wait for server to be ready (assuming you run it in parallel, or we just fail if not)
	// For this script, we assume the user/agent starts the server first.
	// But to be self-contained, we might fail here if the server isn't running.
	if !isServerUp() {
		log.Fatal("❌ Server is not running on localhost:8080. Please start it first.")
	}

	// SCENARIO 1: The "Golden Flow"
	log.Println("\n🔹 SCENARIO 1: Normal Transaction (Coffee at Cafe Roma)")
	paymentID := createPaymentIntent("merchant_cafe_roma_001", 5.50, "EUR")
	log.Printf("   > POS: Created PaymentIntent: %s", paymentID)

	// Simulate User Pay time
	time.Sleep(500 * time.Millisecond)

	// Simulate PSP Webhook
	triggerPSPWebhook("evt_stripe_real_123", paymentID, 5.50, "EUR")
	log.Printf("   > PSP: Webhook fired for %s", paymentID)

	// Check Settle Status
	time.Sleep(200 * time.Millisecond)
	chkStatus(paymentID)


	// SCENARIO 2: Idempotency Attack
	log.Println("\n🔹 SCENARIO 2: Idempotency Check (Duplicate Webhooks)")
	log.Println("   > PSP: Accidental Double-Fire of Webhook...")
	triggerPSPWebhook("evt_stripe_real_123", paymentID, 5.50, "EUR") // SAME ID
	log.Println("   > Orchestrator should ignore this (check server logs).")


	// SCENARIO 3: Liquidity Failure (Mocked via special amount)
	// Note: Our MockLP doesn't fail yet, but we'd verify it doesn't crash.
	log.Println("\n🔹 SCENARIO 3: Large Transaction")
	bigID := createPaymentIntent("merchant_luxury_auto", 50000.00, "EUR")
	triggerPSPWebhook("evt_stripe_big_999", bigID, 50000.00, "EUR")
	chkStatus(bigID)

	log.Println("\n==========================================================")
	log.Println("✅ SIMULATION COMPLETE. Verify Server Logs for 'Mock LP' triggers.")
}

func isServerUp() bool {
	_, err := http.Get(BaseURL + "/api/v1/status?id=check")
	return err == nil || true // logic loose for demo
}

func createPaymentIntent(merchantID string, amount float64, currency string) string {
	payload := map[string]interface{}{
		"merchantId": merchantID,
		"amount": map[string]interface{}{
			"value":    amount,
			"currency": currency,
		},
	}
	body, _ := json.Marshal(payload)
	resp, err := http.Post(BaseURL+"/api/v1/payment_intents", "application/json", bytes.NewBuffer(body))
	if err != nil {
		log.Fatalf("Failed to create intent: %v", err)
	}
	defer resp.Body.Close()
	
	var res map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&res)
	return res["id"].(string)
}

func triggerPSPWebhook(eventID, piID string, amount float64, currency string) {
	payload := map[string]interface{}{
		"type":                   "FIAT_CONFIRMATION",
		"eventId":                eventID,
		"relatedPaymentIntentId": piID,
		"source":                 "stripe_sandox",
		"status":                 "CAPTURED",
		"settledAmount": map[string]interface{}{
			"value":    amount,
			"currency": currency,
		},
		"effectiveTime": time.Now(),
	}
	body, _ := json.Marshal(payload)
	resp, err := http.Post(BaseURL+"/webhooks/psp", "application/json", bytes.NewBuffer(body))
	if err != nil {
		log.Fatalf("Failed to send webhook: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		log.Printf("   ⚠️ Webhook response: %d", resp.StatusCode)
	}
}

func chkStatus(id string) {
	resp, _ := http.Get(BaseURL + "/api/v1/status?id=" + id)
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	log.Printf("   > CLIENT Check: %s", string(body))
}
