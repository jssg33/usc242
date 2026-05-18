package com.cockyremax.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment

/**
 * ContactsFragment — port of contacts.html
 * Implement the same way as ListingsFragment using a separate
 * contacts API endpoint and a matching RecyclerView adapter.
 */
class ContactsFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View = TextView(requireContext()).apply {
        text = "Contact Us — coming soon"
        textAlignment = View.TEXT_ALIGNMENT_CENTER
        textSize = 18f
        setPadding(32, 64, 32, 32)
    }
}
