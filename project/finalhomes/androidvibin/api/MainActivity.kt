package com.cockyremax

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.cockyremax.databinding.ActivityMainBinding
import com.cockyremax.ui.AdminFragment
import com.cockyremax.ui.ContactsFragment
import com.cockyremax.ui.ListingsFragment
import com.cockyremax.ui.LoginDialog
import com.cockyremax.viewmodel.AuthViewModel

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = "Cocky Remax Mix MLS"

        loadFragment(ListingsFragment())

        // ── Bottom nav ─────────────────────────────────────────────────────────
        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_listings -> { loadFragment(ListingsFragment()); true }
                R.id.nav_admin -> {
                    if (authViewModel.isLoggedIn) {
                        loadFragment(AdminFragment())
                    } else {
                        Toast.makeText(this, "Please log in to access Admin.", Toast.LENGTH_SHORT).show()
                        LoginDialog().show(supportFragmentManager, "login")
                    }
                    true
                }
                R.id.nav_contacts -> { loadFragment(ContactsFragment()); true }
                else -> false
            }
        }

        // ── React to login/logout ──────────────────────────────────────────────
        authViewModel.currentUser.observe(this) { user ->
            invalidateOptionsMenu()
            supportActionBar?.subtitle = if (user != null) "Logged in as ${user.username}" else null

            // If logged out while on Admin, kick back to Listings
            if (user == null) {
                val current = supportFragmentManager.findFragmentById(R.id.fragmentContainer)
                if (current is AdminFragment) {
                    loadFragment(ListingsFragment())
                    binding.bottomNav.selectedItemId = R.id.nav_listings
                }
            }
        }
    }

    // ── Toolbar menu ───────────────────────────────────────────────────────────
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.toolbar_menu, menu)
        return true
    }

    override fun onPrepareOptionsMenu(menu: Menu): Boolean {
        val loggedIn = authViewModel.isLoggedIn
        menu.findItem(R.id.action_login)?.isVisible  = !loggedIn
        menu.findItem(R.id.action_logout)?.isVisible = loggedIn
        return super.onPrepareOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {
        R.id.action_login  -> { LoginDialog().show(supportFragmentManager, "login"); true }
        R.id.action_logout -> {
            authViewModel.logout()
            Toast.makeText(this, "Logged out.", Toast.LENGTH_SHORT).show()
            true
        }
        else -> super.onOptionsItemSelected(item)
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
