package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/worldphysical/core-orchestrator/internal/domain"
)

type Handler struct {
	orchestrator *domain.OrchestratorService
	repo         *domain.EventRepository // Using interface
}

// In a real app, this would be injected. For this file, we assume orchestration service has what it needs.
// But we need to expose the creation of PaymentIntents for the POS to call.

type OrchestratorHandler struct {
	Service *domain.OrchestratorService
	Repo interface { // Temporary interface matching MemoryRepository methods needed here
		SavePaymentIntent(intent *domain.PaymentIntent) error
		GetPaymentIntent(id string) (*domain.PaymentIntent, error)
	}
}

func (h *OrchestratorHandler) CreatePaymentIntent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		MerchantID string        `json:"merchantId"`
		Amount     domain.Amount `json:"amount"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	intent := &domain.PaymentIntent{
		ID:         fmt.Sprintf("pi_%d", time.Now().UnixNano()),
		MerchantID: req.MerchantID,
		Amount:     req.Amount,
		Timestamp:  time.Now(),
		Status:     domain.StatusCreated,
	}

	if err := h.Repo.SavePaymentIntent(intent); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("[API] Created Payment Intent: %s for Merchant %s", intent.ID, intent.MerchantID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(intent)
}

func (h *OrchestratorHandler) HandlePSPWebhook(w http.ResponseWriter, r *http.Request) {
	var evt domain.FiatConfirmationEvent
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("[Webhook] Received Fiat Confirmation: %s", evt.EventID)

	if err := h.Service.ProcessFiatConfirmation(evt); err != nil {
		log.Printf("[Webhook] Processing Error: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Event Processed"))
}

func (h *OrchestratorHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	intent, err := h.Repo.GetPaymentIntent(id)
	if err != nil {
		http.Error(w, "Intent not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(intent)
}
