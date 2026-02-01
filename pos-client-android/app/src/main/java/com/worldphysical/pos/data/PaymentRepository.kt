package com.worldphysical.pos.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

// 1. The State Machine
sealed class PaymentState {
    object Idle : PaymentState()
    data class GeneratingQR(val amount: Double) : PaymentState()
    data class WaitingForFiat(val paymentIntentId: String, val qrData: String) : PaymentState()
    data class ProcessingSettlement(val txId: String) : PaymentState() // Visual feedback only, logic is server-side
    data class Paid(val receiptId: String, val amount: Double) : PaymentState()
    data class Error(val message: String) : PaymentState()
}

// 2. The Repository (Single Source of Truth)
class PaymentRepository(
    private val api: BackendApi, // Retrofit interface (stub)
    private val pspAdapter: PSPAdapter // Interface to local card terminal or QR generator
) {
    private val _state = MutableStateFlow<PaymentState>(PaymentState.Idle)
    val state: StateFlow<PaymentState> = _state.asStateFlow()

    suspend fun initiatePayment(amount: Double) {
        _state.value = PaymentState.GeneratingQR(amount)
        
        try {
            // Step 1: Tell Backend we want to receive payment
            val intent = api.createPaymentIntent(amount, "EUR")
            
            // Step 2: Tell PSP to display/process (e.g. show QR on screen or wake up terminal)
            val qrCode = pspAdapter.generatePaymentRequest(intent.id, amount)
            
            _state.value = PaymentState.WaitingForFiat(intent.id, qrCode)
            
            // Step 3: Listen for server confirmation (WebSocket or Long Poll)
            listenForConfirmation(intent.id)
            
        } catch (e: Exception) {
            _state.value = PaymentState.Error("Init failed: ${e.message}")
        }
    }

    private suspend fun listenForConfirmation(intentId: String) {
        // Stub: Real app would use WebSocket
        // Simulate success after 5 seconds
        kotlinx.coroutines.delay(5000)
        _state.value = PaymentState.Paid(UUID.randomUUID().toString(), 0.0) // Mock
    }
    
    fun reset() {
        _state.value = PaymentState.Idle
    }
}

// 3. Adapter Interface
interface PSPAdapter {
    fun generatePaymentRequest(intentId: String, amount: Double): String
}

// 4. API Stub
interface BackendApi {
    suspend fun createPaymentIntent(amount: Double, currency: String): PaymentIntentDto
}

data class PaymentIntentDto(val id: String)
