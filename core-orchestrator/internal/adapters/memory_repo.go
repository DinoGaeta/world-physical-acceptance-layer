package adapters

import (
	"fmt"
	"sync"
	"time"

	"github.com/worldphysical/core-orchestrator/internal/domain"
)

// MemoryRepository is a thread-safe in-memory store for sandbox.
type MemoryRepository struct {
	mu             sync.RWMutex
	paymentIntents map[string]*domain.PaymentIntent
	processedEvents map[string]bool
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		paymentIntents: make(map[string]*domain.PaymentIntent),
		processedEvents: make(map[string]bool),
	}
}

func (r *MemoryRepository) SavePaymentIntent(intent *domain.PaymentIntent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.paymentIntents[intent.ID] = intent
	return nil
}

func (r *MemoryRepository) GetPaymentIntent(id string) (*domain.PaymentIntent, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	intent, exists := r.paymentIntents[id]
	if !exists {
		return nil, fmt.Errorf("payment intent not found: %s", id)
	}
	return intent, nil
}

func (r *MemoryRepository) UpdateIntentStatus(id string, status domain.IntentStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if intent, exists := r.paymentIntents[id]; exists {
		intent.Status = status
		return nil
	}
	return fmt.Errorf("payment intent not found: %s", id)
}

func (r *MemoryRepository) HasEventBeenProcessed(eventID string) (bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.processedEvents[eventID], nil
}

func (r *MemoryRepository) MarkEventProcessed(eventID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.processedEvents[eventID] = true
	return nil
}
