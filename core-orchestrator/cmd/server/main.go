package main

import (
	"log"
	"net/http"
	"time"

	"github.com/worldphysical/core-orchestrator/internal/adapters"
	"github.com/worldphysical/core-orchestrator/internal/api"
	"github.com/worldphysical/core-orchestrator/internal/config"
	"github.com/worldphysical/core-orchestrator/internal/domain"
)

// MockLPAdapter implements domain.LiquidityProvider
type MockLPAdapter struct{
	NodeURL string
}

func (m *MockLPAdapter) RequestSettlement(instr domain.SettlementInstruction) error {
	log.Printf("[Mock LP] Connecting to Node: %s", m.NodeURL)
	log.Printf("[Mock LP] 🚀 SETTLEMENT TRIGGERED! Sending %f %s to %s on %s", 
		instr.Payout.Amount, instr.Payout.Asset, instr.Recipient.Address, instr.Recipient.Chain)
	// Simulate blockchain delay
	time.Sleep(100 * time.Millisecond)
	log.Printf("[Mock LP] ✅ TX CONFIRMED: 0xMOCK_HASH_%s", instr.InstructionID)
	return nil
}

// MockNotifier implements domain.Notifier
type MockNotifier struct{}

func (m *MockNotifier) NotifyReceipt(id string, msg string) {
	log.Printf("[Notifier] 🔔 PUSH to POS (Intent %s): %s", id, msg)
}

func main() {
	log.Println("🌍 World Physical Acceptance Layer - Orchestrator Starting...")
	
	// 0. Load Config
	cfg := config.LoadConfig()
	log.Printf("Loaded Configuration for Port %s", cfg.Port)

	// 1. Initialize Adapters
	repo := adapters.NewMemoryRepository()
	lp := &MockLPAdapter{NodeURL: cfg.LpNodeURL}
	notifier := &MockNotifier{}

	// 2. Initialize Core Service
	// Cast repo to domain.EventRepository interface
	svc := domain.NewOrchestrator(repo, lp, notifier)

	// 3. Initialize API Handlers
	handler := &api.OrchestratorHandler{
		Service: svc,
		Repo:    repo,
	}

	// 4. Setup Router
	mux := http.NewServeMux()
	mux.HandleFunc("/api/v1/payment_intents", handler.CreatePaymentIntent) // POST
	mux.HandleFunc("/webhooks/psp", handler.HandlePSPWebhook)              // POST
	mux.HandleFunc("/api/v1/status", handler.GetStatus)                    // GET

	// 5. Start Server
	log.Printf("🚀 Server listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatal(err)
	}
}
