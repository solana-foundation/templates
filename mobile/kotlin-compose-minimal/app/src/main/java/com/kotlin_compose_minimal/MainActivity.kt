package com.kotlin_compose_minimal

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.kotlin_compose_minimal.ui.theme.KotlinComposeMinimalTheme
import com.solanamobile.seekerconnect.compose.SeekerConnectButton
import com.solanamobile.seekerconnect.compose.SeekerConnectDialogs

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            KotlinComposeMinimalTheme {
                val viewModel: MainViewModel = viewModel()
                val state by viewModel.uiState.collectAsStateWithLifecycle()

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    WalletScreen(
                        state = state,
                        onConnect = { viewModel.connect(this) },
                        onSignMessage = { viewModel.signMessage(this, "Hello from Kotlin Compose Minimal!") },
                        onDisconnect = { viewModel.disconnect() },
                        modifier = Modifier.padding(innerPadding),
                    )
                }
                SeekerConnectDialogs(viewModel.dialogs)
            }
        }
    }
}

@Composable
fun WalletScreen(
    state: WalletUiState,
    onConnect: () -> Unit,
    onSignMessage: () -> Unit,
    onDisconnect: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "Kotlin Compose Minimal + Seeker Connect",
            style = MaterialTheme.typography.titleLarge,
            textAlign = TextAlign.Center,
        )
        if (state.address == null) {
            SeekerConnectButton(onClick = onConnect, enabled = !state.isLoading)
        } else {
            Text(
                text = "Connected: ${state.address.take(4)}…${state.address.takeLast(4)}",
                style = MaterialTheme.typography.bodyLarge,
            )
            Button(onClick = onSignMessage, enabled = !state.isLoading) {
                Text("Sign message")
            }
            OutlinedButton(onClick = onDisconnect, enabled = !state.isLoading) {
                Text("Disconnect")
            }
        }
        state.message?.let {
            Text(
                text = it,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun WalletScreenDisconnectedPreview() {
    KotlinComposeMinimalTheme {
        WalletScreen(
            state = WalletUiState(),
            onConnect = {},
            onSignMessage = {},
            onDisconnect = {},
        )
    }
}

@Preview(showBackground = true)
@Composable
fun WalletScreenConnectedPreview() {
    KotlinComposeMinimalTheme {
        WalletScreen(
            state = WalletUiState(address = "Ho5vmods3ZvjAegHJ8mZTnDa1zbp2Rw4HDNy8Ni2bjfU"),
            onConnect = {},
            onSignMessage = {},
            onDisconnect = {},
        )
    }
}
