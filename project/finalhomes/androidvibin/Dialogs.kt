package com.cockyremax.ui

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.activityViewModels
import com.cockyremax.R
import com.cockyremax.model.*
import com.cockyremax.viewmodel.HomesViewModel

// ══════════════════════════════════════════════════════════════════════════════
//  1. PROPERTY DETAILS  (→ detailsModal)
// ══════════════════════════════════════════════════════════════════════════════
class PropertyDetailsDialog : DialogFragment() {

    companion object {
        private const val ARG_HOME = "home"
        fun newInstance(home: Home): PropertyDetailsDialog {
            val args = Bundle().apply { putSerializable(ARG_HOME, home as java.io.Serializable) }
            return PropertyDetailsDialog().apply { arguments = args }
        }
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        @Suppress("DEPRECATION")
        val home = arguments?.getSerializable(ARG_HOME) as Home

        val message = buildString {
            appendLine("📍 ${home.address.shortDisplay()}")
            appendLine()
            appendLine("💰 Price: ${home.formattedPrice()}")
            appendLine("🏠 Type: ${home.propertyType}")
            appendLine("📊 Status: ${home.status.replaceFirstChar { it.uppercase() }}")
            appendLine()
            appendLine("🛏 Bedrooms: ${home.floorPlan.bedrooms}")
            appendLine("🚿 Bathrooms: ${home.floorPlan.bathrooms}")
            appendLine("📐 Sq Ft: ${home.floorPlan.squareFeet}")
            home.floorPlan.layout?.let { appendLine("📋 Layout: $it") }
            appendLine()
            home.yearBuilt?.let { appendLine("📅 Year Built: $it") }
            home.lotSizeSqft?.let { appendLine("🌿 Lot Size: ${it} sqft") }
            home.description?.let {
                appendLine()
                appendLine("📝 Description:")
                appendLine(it)
            }
            appendLine()
            appendLine("👤 Realtor: ${home.realtor.resellerName}")
            appendLine("📧 ${home.realtor.email}")
            appendLine("📞 ${home.realtor.phone}")
        }

        return AlertDialog.Builder(requireContext())
            .setTitle("Property Details")
            .setMessage(message)
            .setPositiveButton("Close", null)
            .create()
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  2. EDIT REALTOR  (→ realtorModal)
// ══════════════════════════════════════════════════════════════════════════════
class EditRealtorDialog : DialogFragment() {

    companion object {
        fun newInstance(home: Home): EditRealtorDialog {
            val args = Bundle().apply { putSerializable("home", home as java.io.Serializable) }
            return EditRealtorDialog().apply { arguments = args }
        }
    }

    private val viewModel: HomesViewModel by activityViewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.dialog_edit_realtor, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        @Suppress("DEPRECATION")
        val home = arguments?.getSerializable("home") as Home
        val r = home.realtor

        val etUsername = view.findViewById<EditText>(R.id.etUsername)
        val etReseller = view.findViewById<EditText>(R.id.etReseller)
        val etEmail    = view.findViewById<EditText>(R.id.etEmail)
        val etPhone    = view.findViewById<EditText>(R.id.etPhone)
        val btnSave    = view.findViewById<Button>(R.id.btnSave)

        etUsername.setText(r.username)
        etReseller.setText(r.resellerName)
        etEmail.setText(r.email)
        etPhone.setText(r.phone)

        btnSave.setOnClickListener {
            val updated = r.copy(
                username     = etUsername.text.toString(),
                resellerName = etReseller.text.toString(),
                email        = etEmail.text.toString(),
                phone        = etPhone.text.toString()
            )
            viewModel.updateRealtor(r.id, updated)
            dismiss()
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  3. EDIT PROPERTY  (→ propertyModal)
// ══════════════════════════════════════════════════════════════════════════════
class EditPropertyDialog : DialogFragment() {

    companion object {
        fun newInstance(home: Home): EditPropertyDialog {
            val args = Bundle().apply { putSerializable("home", home as java.io.Serializable) }
            return EditPropertyDialog().apply { arguments = args }
        }
    }

    private val viewModel: HomesViewModel by activityViewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.dialog_edit_property, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        @Suppress("DEPRECATION")
        val home = arguments?.getSerializable("home") as Home
        val a = home.address
        val fp = home.floorPlan

        // Address fields
        val etStreet = view.findViewById<EditText>(R.id.etStreet).apply { setText(a.street) }
        val etUnit   = view.findViewById<EditText>(R.id.etUnit).apply   { setText(a.unit ?: "") }
        val etCity   = view.findViewById<EditText>(R.id.etCity).apply   { setText(a.city) }
        val etState  = view.findViewById<EditText>(R.id.etState).apply  { setText(a.state) }
        val etZip    = view.findViewById<EditText>(R.id.etZip).apply    { setText(a.zipCode) }
        val etLat    = view.findViewById<EditText>(R.id.etLat).apply    { setText(a.latitude?.toString() ?: "") }
        val etLng    = view.findViewById<EditText>(R.id.etLng).apply    { setText(a.longitude?.toString() ?: "") }

        // Property fields
        val etPrice       = view.findViewById<EditText>(R.id.etPrice).apply       { setText(home.price.toString()) }
        val spinnerStatus = view.findViewById<Spinner>(R.id.spinnerStatus)
        val etType        = view.findViewById<EditText>(R.id.etType).apply        { setText(home.propertyType) }
        val etYear        = view.findViewById<EditText>(R.id.etYear).apply        { setText(home.yearBuilt?.toString() ?: "") }
        val etLot         = view.findViewById<EditText>(R.id.etLot).apply         { setText(home.lotSizeSqft?.toString() ?: "") }
        val etDescription = view.findViewById<EditText>(R.id.etDescription).apply { setText(home.description ?: "") }

        // Floor plan
        val etBedrooms = view.findViewById<EditText>(R.id.etBedrooms).apply { setText(fp.bedrooms.toString()) }
        val etBathrooms= view.findViewById<EditText>(R.id.etBathrooms).apply{ setText(fp.bathrooms.toString()) }
        val etSqft     = view.findViewById<EditText>(R.id.etSqft).apply     { setText(fp.squareFeet.toString()) }
        val etLayout   = view.findViewById<EditText>(R.id.etLayout).apply   { setText(fp.layout ?: "") }

        val statusOptions = arrayOf("available", "pending", "sold")
        spinnerStatus.adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, statusOptions)
        spinnerStatus.setSelection(statusOptions.indexOf(home.status))

        view.findViewById<Button>(R.id.btnSave).setOnClickListener {
            val fields = mapOf(
                "price"        to etPrice.text.toString().toDoubleOrNull(),
                "status"       to statusOptions[spinnerStatus.selectedItemPosition],
                "property_type"to etType.text.toString(),
                "year_built"   to etYear.text.toString().toIntOrNull(),
                "lot_size_sqft"to etLot.text.toString().toIntOrNull(),
                "description"  to etDescription.text.toString()
            )
            viewModel.updateProperty(home.id, fields)
            dismiss()
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  4. EDIT PICTURES  (→ picturesModal)
// ══════════════════════════════════════════════════════════════════════════════
class EditPicturesDialog : DialogFragment() {

    companion object {
        fun newInstance(home: Home): EditPicturesDialog {
            val args = Bundle().apply { putSerializable("home", home as java.io.Serializable) }
            return EditPicturesDialog().apply { arguments = args }
        }
    }

    private val viewModel: HomesViewModel by activityViewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.dialog_edit_pictures, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        @Suppress("DEPRECATION")
        val home = arguments?.getSerializable("home") as Home

        val containerExisting = view.findViewById<LinearLayout>(R.id.containerExisting)
        val etNewUrls         = view.findViewById<EditText>(R.id.etNewUrls)
        val btnSave           = view.findViewById<Button>(R.id.btnSave)

        // Show existing images with delete buttons
        home.images.forEach { img ->
            val row = LinearLayout(requireContext()).apply {
                orientation = LinearLayout.HORIZONTAL
                setPadding(0, 4, 0, 4)
            }
            val tv = TextView(requireContext()).apply {
                text = img.imageUrl
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
                maxLines = 1
                ellipsize = android.text.TextUtils.TruncateAt.END
            }
            val btn = Button(requireContext()).apply {
                text = "✕"
                setOnClickListener {
                    viewModel.deleteImage(img.id)
                    containerExisting.removeView(row)
                }
            }
            row.addView(tv)
            row.addView(btn)
            containerExisting.addView(row)
        }

        btnSave.setOnClickListener {
            etNewUrls.text.toString()
                .lines()
                .map { it.trim() }
                .filter { it.isNotEmpty() }
                .forEach { url -> viewModel.addImage(home.id, url) }
            dismiss()
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  5. ADD NEW HOME  (→ newHomeModal)
// ══════════════════════════════════════════════════════════════════════════════
class AddHomeDialog : DialogFragment() {

    private val viewModel: HomesViewModel by activityViewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.dialog_add_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val etUsername    = view.findViewById<EditText>(R.id.etNewUsername)
        val etReseller    = view.findViewById<EditText>(R.id.etNewReseller)
        val etEmail       = view.findViewById<EditText>(R.id.etNewEmail)
        val etPhone       = view.findViewById<EditText>(R.id.etNewPhone)
        val etStreet      = view.findViewById<EditText>(R.id.etNewStreet)
        val etUnit        = view.findViewById<EditText>(R.id.etNewUnit)
        val etCity        = view.findViewById<EditText>(R.id.etNewCity)
        val etState       = view.findViewById<EditText>(R.id.etNewState)
        val etZip         = view.findViewById<EditText>(R.id.etNewZip)
        val etLat         = view.findViewById<EditText>(R.id.etNewLat)
        val etLng         = view.findViewById<EditText>(R.id.etNewLng)
        val etPrice       = view.findViewById<EditText>(R.id.etNewPrice)
        val spinnerStatus = view.findViewById<Spinner>(R.id.spinnerNewStatus)
        val spinnerType   = view.findViewById<Spinner>(R.id.spinnerNewType)
        val etYear        = view.findViewById<EditText>(R.id.etNewYear)
        val etLot         = view.findViewById<EditText>(R.id.etNewLot)
        val etDescription = view.findViewById<EditText>(R.id.etNewDescription)
        val etBedrooms    = view.findViewById<EditText>(R.id.etNewBedrooms)
        val etBathrooms   = view.findViewById<EditText>(R.id.etNewBathrooms)
        val etSqft        = view.findViewById<EditText>(R.id.etNewSqft)
        val etLayout      = view.findViewById<EditText>(R.id.etNewLayout)
        val etImages      = view.findViewById<EditText>(R.id.etNewImages)

        val statusOptions = arrayOf("available", "pending", "sold")
        val typeOptions   = arrayOf("single-family", "townhome", "condo", "multi-family")

        spinnerStatus.adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, statusOptions)
        spinnerType.adapter   = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, typeOptions)

        view.findViewById<Button>(R.id.btnCreateHome).setOnClickListener {
            // Basic validation
            if (etReseller.text.isBlank() || etEmail.text.isBlank() || etStreet.text.isBlank() ||
                etCity.text.isBlank() || etState.text.isBlank() || etZip.text.isBlank() ||
                etPrice.text.isBlank() || etBedrooms.text.isBlank() || etBathrooms.text.isBlank() ||
                etSqft.text.isBlank()) {
                Toast.makeText(requireContext(), "Please fill in all required fields.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val imageUrls = etImages.text.toString()
                .lines().map { it.trim() }.filter { it.isNotEmpty() }

            val request = NewHomeRequest(
                realtor = Realtor(
                    username     = etUsername.text.toString(),
                    resellerName = etReseller.text.toString(),
                    email        = etEmail.text.toString(),
                    phone        = etPhone.text.toString()
                ),
                address = Address(
                    street    = etStreet.text.toString(),
                    unit      = etUnit.text.toString().ifBlank { null },
                    city      = etCity.text.toString(),
                    state     = etState.text.toString(),
                    zipCode   = etZip.text.toString(),
                    latitude  = etLat.text.toString().toDoubleOrNull(),
                    longitude = etLng.text.toString().toDoubleOrNull()
                ),
                floorPlan = FloorPlan(
                    bedrooms   = etBedrooms.text.toString().toInt(),
                    bathrooms  = etBathrooms.text.toString().toDouble(),
                    squareFeet = etSqft.text.toString().toInt(),
                    layout     = etLayout.text.toString().ifBlank { null }
                ),
                price        = etPrice.text.toString().toDouble(),
                status       = statusOptions[spinnerStatus.selectedItemPosition],
                propertyType = typeOptions[spinnerType.selectedItemPosition],
                yearBuilt    = etYear.text.toString().toIntOrNull(),
                lotSizeSqft  = etLot.text.toString().toIntOrNull(),
                description  = etDescription.text.toString().ifBlank { null },
                images       = imageUrls
            )
            viewModel.createHome(request)
            dismiss()
        }
    }
}
