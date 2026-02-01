package com.worldphysical.pos.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.worldphysical.pos.data.PaymentState

@Composable
fun PosScreen(
    state: PaymentState,
    onInitiatePayment: (Double) -> Unit,
    onReset: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            when (state) {
                is PaymentState.Idle -> IdleView(onInitiatePayment)
                is PaymentState.GeneratingQR -> LoadingView("Generating Order...")
                is PaymentState.WaitingForFiat -> QRView(state)
                is PaymentState.ProcessingSettlement -> LoadingView("Verifying & Settling...")
                is PaymentState.Paid -> SuccessView(state, onReset)
                is PaymentState.Error -> ErrorView(state, onReset)
            }
        }
    }
}

@Composable
fun IdleView(onPay: (Double) -> Unit) {
    var amount by remember { mutableStateOf("") }
    
    Text("World Physical Layer", style = MaterialTheme.typography.headlineMedium)
    Spacer(Modifier.height(32.dp))
    
    OutlinedTextField(
        value = amount,
        onValueChange = { amount = it },
        label = { Text("Amount (EUR)") },
        modifier = Modifier.fillMaxWidth()
    )
    
    Spacer(Modifier.height(16.dp))
    
    Button(
        onClick = { amount.toDoubleOrNull()?.let { onPay(it) } },
        modifier = Modifier.fillMaxWidth().height(56.dp)
    ) {
        Text("Charge Web3-Linked Card")
    }
}

@Composable
fun QRView(state: PaymentState.WaitingForFiat) {
    Text("Scan to Pay", style = MaterialTheme.typography.titleLarge)
    Spacer(Modifier.height(16.dp))
    // In real app, render state.qrData as QRCode Image
    Box(
        modifier = Modifier.size(200.dp).padding(10.dp),
        contentAlignment = Alignment.Center
    ) {
        Text("[ QR CODE: ${state.qrData} ]")
    }
    Spacer(Modifier.height(16.dp))
    LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
    Text("Waiting for network confirmation...", style = MaterialTheme.typography.bodySmall)
}

@Composable
fun SuccessView(state: PaymentState.Paid, onReset: () -> Unit) {
    Text("Payment Settled", color = MaterialTheme.colorScheme.primary, fontSize = 24.sp)
    Spacer(Modifier.height(16.dp))
    Text("Funds settled to Merchant World Wallet")
    Spacer(Modifier.height(32.dp))
    Button(onClick = onReset) {
        Text("Next Customer")
    }
}

@Composable
fun ErrorView(state: PaymentState.Error, onReset: () -> Unit) {
    Text("Error", color = MaterialTheme.colorScheme.error)
    Text(state.message)
    Button(onClick = onReset) { Text("Retry") }
}

@Composable
fun LoadingView(msg: String) {
    CircularProgressIndicator()
    Spacer(Modifier.height(16.dp))
    Text(msg)
}
