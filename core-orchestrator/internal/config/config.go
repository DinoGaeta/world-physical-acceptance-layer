package config

import (
	"os"
	"log"
)

type Config struct {
	Port              string
	StripeSecretKey   string
	StripeWebhookKey  string
	LpNodeURL         string
	LpAPIKey          string
	ChainRPC          string
}

func LoadConfig() *Config {
	return &Config{
		Port:             getEnv("PORT", "8080"),
		StripeSecretKey:  getEnv("STRIPE_SECRET_KEY", ""),
		StripeWebhookKey: getEnv("STRIPE_WEBHOOK_SECRET", ""),
		LpNodeURL:        getEnv("LP_NODE_URL", ""),
		LpAPIKey:         getEnv("LP_API_KEY", ""),
		ChainRPC:         getEnv("CHAIN_RPC_URL", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	if fallback == "" {
		log.Printf("[Config] Warning: %s not set", key)
	}
	return fallback
}
