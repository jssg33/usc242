package com.cockyremax.ui

import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.activityViewModels
import com.cockyremax.R
import com.cockyremax.viewmodel.AuthViewModel
import java.io.ByteArrayOutputStream

/**
 * Modal equivalent of the navbar "Login" button.
 * Two tabs: Login and Register.
 * On successful login → dismisses and the toolbar updates via AuthViewModel LiveData.
 */
class LoginDialog : DialogFragment() {

    private val authViewModel: AuthViewModel by activityViewModels()

    // Holds image bytes picked for the register avatar
    private var pickedImageBytes: ByteArray? = null

    // Image picker launcher
    private val pickImageLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                val uri = result.data?.data ?: return@registerForActivityResult
                val stream = requireContext().contentResolver.openInputStream(uri) ?: return@registerForActivityResult
                val bitmap = BitmapFactory.decodeStream(stream)
                val bos = ByteArrayOutputStream()
                bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 90, bos)
                pickedImageBytes = bos.toByteArray()
                view?.findViewById<ImageView>(R.id.imgRegisterPicture)
                    ?.setImageBitmap(bitmap)
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ) = inflater.inflate(R.layout.dialog_login, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val tabLogin    = view.findViewById<TextView>(R.id.tabLogin)
        val tabRegister = view.findViewById<TextView>(R.id.tabRegister)
        val panelLogin  = view.findViewById<View>(R.id.panelLogin)
        val panelRegister = view.findViewById<View>(R.id.panelRegister)
        val tvError     = view.findViewById<TextView>(R.id.tvAuthError)

        // ── Tab switching ──────────────────────────────────────────────────────
        fun showLogin() {
            panelLogin.visibility    = View.VISIBLE
            panelRegister.visibility = View.GONE
            tabLogin.setBackgroundResource(R.color.tab_active)
            tabRegister.setBackgroundResource(R.color.tab_inactive)
            tvError.visibility = View.GONE
        }
        fun showRegister() {
            panelLogin.visibility    = View.GONE
            panelRegister.visibility = View.VISIBLE
            tabLogin.setBackgroundResource(R.color.tab_inactive)
            tabRegister.setBackgroundResource(R.color.tab_active)
            tvError.visibility = View.GONE
        }

        tabLogin.setOnClickListener    { showLogin() }
        tabRegister.setOnClickListener { showRegister() }
        showLogin() // default tab

        // ── Observe auth errors ────────────────────────────────────────────────
        authViewModel.authError.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                tvError.text = error
                tvError.visibility = View.VISIBLE
            } else {
                tvError.visibility = View.GONE
            }
        }

        // ── LOGIN panel ────────────────────────────────────────────────────────
        val etLoginUsername = view.findViewById<EditText>(R.id.etLoginUsername)
        val etLoginPassword = view.findViewById<EditText>(R.id.etLoginPassword)

        view.findViewById<Button>(R.id.btnLogin).setOnClickListener {
            val success = authViewModel.login(
                etLoginUsername.text.toString().trim(),
                etLoginPassword.text.toString()
            )
            if (success) dismiss()
        }

        // ── REGISTER panel ─────────────────────────────────────────────────────
        val etRegUsername = view.findViewById<EditText>(R.id.etRegUsername)
        val etRegPassword = view.findViewById<EditText>(R.id.etRegPassword)
        val etRegConfirm  = view.findViewById<EditText>(R.id.etRegConfirm)
        val imgPicture    = view.findViewById<ImageView>(R.id.imgRegisterPicture)
        val btnPickPicture= view.findViewById<Button>(R.id.btnPickPicture)

        btnPickPicture.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            pickImageLauncher.launch(intent)
        }

        view.findViewById<Button>(R.id.btnRegister).setOnClickListener {
            val username = etRegUsername.text.toString().trim()
            val password = etRegPassword.text.toString()
            val confirm  = etRegConfirm.text.toString()

            if (password != confirm) {
                authViewModel // trigger the error display
                view.findViewById<TextView>(R.id.tvAuthError).apply {
                    text = "Passwords do not match."
                    visibility = View.VISIBLE
                }
                return@setOnClickListener
            }

            val generatedId = authViewModel.register(username, password, pickedImageBytes)
            if (generatedId != null) {
                // Auto-login after successful registration
                authViewModel.login(username, password)
                dismiss()
            }
            // else: authError LiveData will show the message
        }
    }

    override fun onStart() {
        super.onStart()
        // Make the dialog reasonably wide
        dialog?.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.92).toInt(),
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
    }
}
