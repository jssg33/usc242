package com.cockyremax.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.cockyremax.adapter.AdminTableAdapter
import com.cockyremax.databinding.FragmentAdminBinding
import com.cockyremax.model.Home
import com.cockyremax.viewmodel.HomesViewModel
import com.cockyremax.viewmodel.UiState

class AdminFragment : Fragment() {

    private var _binding: FragmentAdminBinding? = null
    private val binding get() = _binding!!

    private val viewModel: HomesViewModel by activityViewModels()
    private lateinit var adapter: AdminTableAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = AdminTableAdapter(
            homes       = emptyList(),
            onEdit      = { home -> openEditMenu(home) },
            onDelete    = { home -> confirmDelete(home) }
        )
        binding.recyclerAdmin.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerAdmin.adapter = adapter

        binding.btnAddHome.setOnClickListener {
            AddHomeDialog().show(childFragmentManager, "addHome")
        }

        viewModel.homes.observe(viewLifecycleOwner) { state ->
            when (state) {
                is UiState.Loading -> binding.progressBar.visibility = View.VISIBLE
                is UiState.Success -> {
                    binding.progressBar.visibility = View.GONE
                    adapter.updateData(state.data)
                }
                is UiState.Error -> {
                    binding.progressBar.visibility = View.GONE
                    Toast.makeText(requireContext(), state.message, Toast.LENGTH_LONG).show()
                }
            }
        }

        viewModel.actionResult.observe(viewLifecycleOwner) { state ->
            if (state is UiState.Success) {
                Toast.makeText(requireContext(), state.data, Toast.LENGTH_SHORT).show()
            } else if (state is UiState.Error) {
                Toast.makeText(requireContext(), state.message, Toast.LENGTH_LONG).show()
            }
        }

        viewModel.fetchHomes()
    }

    // ── Context menu (mirrors the three "edit" buttons per row in the HTML) ────
    private fun openEditMenu(home: Home) {
        val options = arrayOf("Edit Realtor Info", "Edit Property Info", "Update Pictures")
        AlertDialog.Builder(requireContext())
            .setTitle("Edit: ${home.address.shortDisplay()}")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> EditRealtorDialog.newInstance(home).show(childFragmentManager, "editRealtor")
                    1 -> EditPropertyDialog.newInstance(home).show(childFragmentManager, "editProperty")
                    2 -> EditPicturesDialog.newInstance(home).show(childFragmentManager, "editPictures")
                }
            }
            .show()
    }

    private fun confirmDelete(home: Home) {
        AlertDialog.Builder(requireContext())
            .setTitle("Delete Home")
            .setMessage("Delete ${home.address.shortDisplay()}?")
            .setPositiveButton("Delete") { _, _ -> viewModel.deleteHome(home.id) }
            .setNegativeButton("Cancel", null)
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
