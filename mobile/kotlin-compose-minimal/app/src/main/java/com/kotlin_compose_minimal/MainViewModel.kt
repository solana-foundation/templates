package com.kotlin_compose_minimal

import android.app.Application
import androidx.activity.ComponentActivity
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.viewModelScope
import com.funkatronics.encoders.Base58
import com.solanamobile.seekerconnect.DappIdentity
import com.solanamobile.seekerconnect.SeekerConnect
import com.solanamobile.seekerconnect.SeekerConnectConfig
import com.solanamobile.seekerconnect.SeekerConnectException
import com.solanamobile.seekerconnect.android.MwaSeekerLink
import com.solanamobile.seekerconnect.android.SharedPreferencesAuthorizationCache
import com.solanamobile.seekerconnect.compose.SeekerConnectDialogState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class WalletUiState(
    val address: String? = null,
    val isLoading: Boolean = false,
    val message: String? = null,
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    val dialogs = SeekerConnectDialogState()

    // Replace with your app's own domain and host a Digital Asset Links file there so
    // wallets can verify your app identity: https://docs.solanamobile.com/android-native/using_mobile_wallet_adapter
    private val seekerConnect = SeekerConnect(
        SeekerConnectConfig(
            identity = DappIdentity("Kotlin Compose Minimal", "https://yourdapp.com", "favicon.ico"),
            chain = "solana:devnet",
        ),
        MwaSeekerLink(application),
        SharedPreferencesAuthorizationCache(application),
        dialogs,
    )

    private val _uiState = MutableStateFlow(WalletUiState())
    val uiState: StateFlow<WalletUiState> = _uiState.asStateFlow()

    init {
        seekerConnect.authorization
            .onEach { authorization -> _uiState.update { it.copy(address = authorization?.accounts?.first()?.address) } }
            .launchIn(viewModelScope)
        viewModelScope.launch { seekerConnect.restore() }
    }

    fun connect(host: ComponentActivity) = host.lifecycleScope.launch {
        perform { seekerConnect.connect(host); null }
    }

    fun signMessage(host: ComponentActivity, message: String) = host.lifecycleScope.launch {
        perform {
            val address = checkNotNull(_uiState.value.address)
            val signature = seekerConnect.signMessages(host, listOf(address), listOf(message.encodeToByteArray())).single()
            "Signature: ${Base58.encodeToString(signature)}"
        }
    }

    fun disconnect() = viewModelScope.launch {
        perform { seekerConnect.disconnect(); null }
    }

    private suspend fun perform(action: suspend () -> String?) {
        _uiState.update { it.copy(isLoading = true, message = null) }
        try {
            val message = action()
            _uiState.update { it.copy(message = message) }
        } catch (e: SeekerConnectException) {
            _uiState.update { it.copy(message = "Failed: ${e.code}") }
        } finally {
            _uiState.update { it.copy(isLoading = false) }
        }
    }
}
