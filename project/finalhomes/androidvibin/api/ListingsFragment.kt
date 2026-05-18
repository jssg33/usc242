package com.cockyremax.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.cockyremax.adapter.HomeCardAdapter
import com.cockyremax.databinding.FragmentListingsBinding
import com.cockyremax.model.Home
import com.cockyremax.viewmodel.HomesViewModel
import com.cockyremax.viewmodel.UiState

class ListingsFragment : Fragment() {

    private var _binding: FragmentListingsBinding? = null
    private val binding get() = _binding!!

    private val viewModel: HomesViewModel by activityViewModels()
    private lateinit var adapter: HomeCardAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentListingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = HomeCardAdapter(emptyList()) { home -> showDetailsDialog(home) }

        binding.recyclerHomes.layoutManager = GridLayoutManager(requireContext(), 2)
        binding.recyclerHomes.adapter = adapter

        viewModel.homes.observe(viewLifecycleOwner) { state ->
            when (state) {
                is UiState.Loading -> binding.progressBar.visibility = View.VISIBLE
                is UiState.Success -> {
                    binding.progressBar.visibility = View.GONE
                    adapter.updateData(state.data.filter { it.status == "available" })
                }
                is UiState.Error -> {
                    binding.progressBar.visibility = View.GONE
                    Toast.makeText(requireContext(), state.message, Toast.LENGTH_LONG).show()
                }
            }
        }

        viewModel.fetchHomes()
    }

    private fun showDetailsDialog(home: Home) {
        PropertyDetailsDialog.newInstance(home).show(childFragmentManager, "details")
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
