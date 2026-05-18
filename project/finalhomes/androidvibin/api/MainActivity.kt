package com.cockyremax

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.cockyremax.databinding.ActivityMainBinding
import com.cockyremax.ui.AdminFragment
import com.cockyremax.ui.ContactsFragment
import com.cockyremax.ui.ListingsFragment

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = "Cocky Remax Mix MLS"

        // Default fragment
        loadFragment(ListingsFragment())

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_listings -> loadFragment(ListingsFragment())
                R.id.nav_admin    -> loadFragment(AdminFragment())
                R.id.nav_contacts -> loadFragment(ContactsFragment())
            }
            true
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
