package domain

import (
	"time"
)

// PaymentIntent represents the merchant's request to accept payment.
type PaymentIntent struct {
	ID         string            `json:"id"`
	MerchantID string            `json:"merchantId"`
	Amount     Amount            `json:"amount"`
	Timestamp  time.Time         `json:"timestamp"`
	Metadata   map[string]string `json:"metadata"`
	Status     IntentStatus      `json:"status"`
}

type Amount struct {
	Value    float64 `json:"value"`
	Currency string  `json:"currency"`
}

type IntentStatus string

const (
	StatusCreated  IntentStatus = "CREATED"
	StatusFunded   IntentStatus = "FUNDED"
	StatusSettled  IntentStatus = "SETTLED"
	StatusFailed   IntentStatus = "FAILED"
)

// FiatConfirmationEvent is the trigger from the PSP.
type FiatConfirmationEvent struct {
	Type                 string    `json:"type"`
	EventID              string    `json:"eventId"`
	RelatedPaymentIntent string    `json:"relatedPaymentIntentId"`
	Source               string    `json:"source"`
	Status               string    `json:"status"`
	SettledAmount        Amount    `json:"settledAmount"`
	EffectiveTime        time.Time `json:"effectiveTime"`
}

// SettlementInstruction tells the LP to release funds.
type SettlementInstruction struct {
	InstructionID   string          `json:"instructionId"`
	TriggerEventID  string          `json:"triggerEventId"`
	Recipient       WalletRecipient `json:"recipient"`
	Payout          PayoutDetails   `json:"payout"`
	Deadline        time.Time       `json:"deadline"`
}

type WalletRecipient struct {
	Chain   string `json:"walletChain"` // e.g. "world_chain"
	Address string `json:"walletAddress"`
}

type PayoutDetails struct {
	Asset string  `json:"asset"` // e.g. "USDC"
	Amount float64 `json:"amount"`
}
