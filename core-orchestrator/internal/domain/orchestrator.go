package domain

import (
	"errors"
	"fmt"
	"log"
	"sync"
)

// OrchestratorService is the main business logic handler.
// It is stateless in design, but uses a repository interface for event logging/idempotency.
type OrchestratorService struct {
	repo       EventRepository
	lpAdapter  LiquidityProvider
	notifiers  []Notifier
}

func NewOrchestrator(repo EventRepository, lp LiquidityProvider, notifiers ...Notifier) *OrchestratorService {
	return &OrchestratorService{
		repo:      repo,
		lpAdapter: lp,
		notifiers: notifiers,
	}
}

// ProcessFiatConfirmation handles the webhook from the PSP.
func (s *OrchestratorService) ProcessFiatConfirmation(evt FiatConfirmationEvent) error {
	// 1. Idempotency Check
	exists, err := s.repo.HasEventBeenProcessed(evt.EventID)
	if err != nil {
		return fmt.Errorf("idempotency check failed: %w", err)
	}
	if exists {
		log.Printf("Event %s already processed. Skipping.", evt.EventID)
		return nil
	}

	log.Printf("Processing Fiat Confirmation: %s for Amount: %f %s", evt.EventID, evt.SettledAmount.Value, evt.SettledAmount.Currency)

	// 2. Validate Payment Intent (verify it exists and isn't already settled)
	intent, err := s.repo.GetPaymentIntent(evt.RelatedPaymentIntent)
	if err != nil {
		return fmt.Errorf("payment intent not found: %w", err)
	}
	if intent.Status == StatusSettled {
		log.Printf("PaymentIntent %s already settled.", intent.ID)
		return nil
	}

	// 3. Create Settlement Instruction
	instruction := SettlementInstruction{
		InstructionID:  generateID("instr"),
		TriggerEventID: evt.EventID,
		Recipient: WalletRecipient{
			Chain:   "world_chain",
			Address: getMerchantWalletAddress(intent.MerchantID), // Lookup logic
		},
		Payout: PayoutDetails{
			Asset:  "USDC", // MVP Constraint: USDC only
			Amount: evt.SettledAmount.Value, // MVP Assumption: 1:1 Peg for USD, or simple conversion for EUR. Ignoring fees for MVP code visibility.
		},
	}

	// 4. Execute Settlement via LP
	err = s.lpAdapter.RequestSettlement(instruction)
	if err != nil {
		log.Printf("Settlement Failed: %v", err)
		// Logic to queue for retry or alert operator
		return fmt.Errorf("settlement request failed: %w", err)
	}

	// 5. Update State & Notify
	s.repo.MarkEventProcessed(evt.EventID)
	s.repo.UpdateIntentStatus(intent.ID, StatusSettled)
	
	for _, n := range s.notifiers {
		n.NotifyReceipt(intent.ID, "Payment Settled via World Chain")
	}

	return nil
}

// --- Interfaces & Mocks (In-file for MVP conciseness) ---

type EventRepository interface {
	HasEventBeenProcessed(eventID string) (bool, error)
	MarkEventProcessed(eventID string) error
	GetPaymentIntent(id string) (*PaymentIntent, error)
	UpdateIntentStatus(id string, status IntentStatus) error
}

type LiquidityProvider interface {
	RequestSettlement(instr SettlementInstruction) error
}

type Notifier interface {
	NotifyReceipt(paymentIntentID string, message string)
}

// Helpers
func generateID(prefix string) string {
	return fmt.Sprintf("%s_%d", prefix, time.Now().UnixNano())
}

func getMerchantWalletAddress(merchantID string) string {
	// Stub: In real app, look up from Merchant DB
	return "0x1234567890ABCDEF1234567890ABCDEF12345678" 
}
