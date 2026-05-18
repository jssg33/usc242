package com.cockyremax.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.cockyremax.model.*
import com.cockyremax.network.RetrofitClient
import kotlinx.coroutines.launch

sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}

class HomesViewModel : ViewModel() {

    private val api = RetrofitClient.api

    private val _homes = MutableLiveData<UiState<List<Home>>>()
    val homes: LiveData<UiState<List<Home>>> = _homes

    private val _actionResult = MutableLiveData<UiState<String>>()
    val actionResult: LiveData<UiState<String>> = _actionResult

    // ── Fetch all homes ────────────────────────────────────────────────────────
    fun fetchHomes() {
        _homes.value = UiState.Loading
        viewModelScope.launch {
            try {
                val response = api.getHomes()
                if (response.isSuccessful) {
                    _homes.value = UiState.Success(response.body() ?: emptyList())
                } else {
                    _homes.value = UiState.Error("Error ${response.code()}: ${response.message()}")
                }
            } catch (e: Exception) {
                _homes.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    // ── Delete home ────────────────────────────────────────────────────────────
    fun deleteHome(id: Int) {
        viewModelScope.launch {
            try {
                val response = api.deleteHome(id)
                if (response.isSuccessful) {
                    _actionResult.value = UiState.Success("Home deleted")
                    fetchHomes() // refresh
                } else {
                    _actionResult.value = UiState.Error("Delete failed: ${response.code()}")
                }
            } catch (e: Exception) {
                _actionResult.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    // ── Update realtor ─────────────────────────────────────────────────────────
    fun updateRealtor(id: Int, realtor: Realtor) {
        viewModelScope.launch {
            try {
                val response = api.updateRealtor(id, realtor)
                if (response.isSuccessful) {
                    _actionResult.value = UiState.Success("Realtor updated")
                    fetchHomes()
                } else {
                    _actionResult.value = UiState.Error("Update failed: ${response.code()}")
                }
            } catch (e: Exception) {
                _actionResult.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    // ── Update property ────────────────────────────────────────────────────────
    fun updateProperty(id: Int, fields: Map<String, Any?>) {
        viewModelScope.launch {
            try {
                val response = api.updateProperty(id, fields)
                if (response.isSuccessful) {
                    _actionResult.value = UiState.Success("Property updated")
                    fetchHomes()
                } else {
                    _actionResult.value = UiState.Error("Update failed: ${response.code()}")
                }
            } catch (e: Exception) {
                _actionResult.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    // ── Create home ────────────────────────────────────────────────────────────
    fun createHome(request: NewHomeRequest) {
        viewModelScope.launch {
            try {
                val response = api.createHome(request)
                if (response.isSuccessful) {
                    _actionResult.value = UiState.Success("Home created")
                    fetchHomes()
                } else {
                    _actionResult.value = UiState.Error("Create failed: ${response.code()}")
                }
            } catch (e: Exception) {
                _actionResult.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    // ── Add image ──────────────────────────────────────────────────────────────
    fun addImage(homeId: Int, url: String) {
        viewModelScope.launch {
            try {
                api.addImage(homeId, mapOf("image_url" to url))
            } catch (_: Exception) {}
        }
    }

    // ── Delete image ───────────────────────────────────────────────────────────
    fun deleteImage(imageId: Int) {
        viewModelScope.launch {
            try {
                api.deleteImage(imageId)
            } catch (_: Exception) {}
        }
    }
}
