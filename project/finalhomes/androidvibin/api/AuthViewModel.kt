package com.cockyremax.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.cockyremax.db.User
import com.cockyremax.db.UserDatabase

/**
 * Holds the current login session.
 * Shared via activityViewModels() so MainActivity, AdminFragment,
 * and the login dialog all see the same state.
 */
class AuthViewModel(app: Application) : AndroidViewModel(app) {

    private val db = UserDatabase(app)

    // null = logged out; non-null = logged in user
    private val _currentUser = MutableLiveData<User?>(null)
    val currentUser: LiveData<User?> = _currentUser

    private val _authError = MutableLiveData<String?>()
    val authError: LiveData<String?> = _authError

    val isLoggedIn: Boolean get() = _currentUser.value != null

    // ── Login ──────────────────────────────────────────────────────────────────
    fun login(username: String, password: String): Boolean {
        if (username.isBlank() || password.isBlank()) {
            _authError.value = "Username and password are required."
            return false
        }
        val user = db.authenticate(username, password)
        return if (user != null) {
            _currentUser.value = user
            _authError.value = null
            true
        } else {
            _authError.value = "Invalid username or password."
            false
        }
    }

    // ── Register ───────────────────────────────────────────────────────────────
    // Returns the generated userid string on success, null on failure
    fun register(username: String, password: String, picture: ByteArray? = null): String? {
        if (username.isBlank() || password.isBlank()) {
            _authError.value = "Username and password are required."
            return null
        }
        if (db.usernameExists(username)) {
            _authError.value = "Username \"$username\" is already taken."
            return null
        }
        val userId = db.insertUser(username, password, picture)
        return if (userId != null) {
            _authError.value = null
            userId
        } else {
            _authError.value = "Registration failed. Please try again."
            null
        }
    }

    // ── Logout ─────────────────────────────────────────────────────────────────
    fun logout() {
        _currentUser.value = null
        _authError.value = null
    }

    // ── Update profile picture ─────────────────────────────────────────────────
    fun updatePicture(picture: ByteArray) {
        val user = _currentUser.value ?: return
        if (db.updatePicture(user.userid, picture)) {
            _currentUser.value = user.copy(picture = picture)
        }
    }
}
