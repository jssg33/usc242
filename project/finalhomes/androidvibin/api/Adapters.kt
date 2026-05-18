package com.cockyremax.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.cockyremax.R
import com.cockyremax.model.Home

// ══════════════════════════════════════════════════════════════════════════════
//  USER-FACING CARD ADAPTER  (homesContainer grid)
// ══════════════════════════════════════════════════════════════════════════════
class HomeCardAdapter(
    private var homes: List<Home>,
    private val onClick: (Home) -> Unit
) : RecyclerView.Adapter<HomeCardAdapter.CardVH>() {

    fun updateData(newHomes: List<Home>) {
        homes = newHomes
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CardVH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_home_card, parent, false)
        return CardVH(view)
    }

    override fun onBindViewHolder(holder: CardVH, position: Int) {
        holder.bind(homes[position], onClick)
    }

    override fun getItemCount() = homes.size

    class CardVH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val imgHome   : ImageView = itemView.findViewById(R.id.imgHome)
        private val tvAddress : TextView  = itemView.findViewById(R.id.tvAddress)
        private val tvPrice   : TextView  = itemView.findViewById(R.id.tvPrice)
        private val tvBeds    : TextView  = itemView.findViewById(R.id.tvBeds)
        private val tvStatus  : TextView  = itemView.findViewById(R.id.tvStatus)
        private val btnDetails: Button    = itemView.findViewById(R.id.btnDetails)

        fun bind(home: Home, onClick: (Home) -> Unit) {
            tvAddress.text = home.address.shortDisplay()
            tvPrice.text   = home.formattedPrice()
            tvBeds.text    = "${home.floorPlan.bedrooms} bd · ${home.floorPlan.bathrooms} ba · ${home.floorPlan.squareFeet} sqft"
            tvStatus.text  = home.status.replaceFirstChar { it.uppercase() }

            // Status badge colour
            val ctx = itemView.context
            tvStatus.setTextColor(
                when (home.status) {
                    "available" -> ContextCompat.getColor(ctx, R.color.status_available)
                    "pending"   -> ContextCompat.getColor(ctx, R.color.status_pending)
                    else        -> ContextCompat.getColor(ctx, R.color.status_sold)
                }
            )

            // Load first image with Glide
            val firstImage = home.images.firstOrNull()?.imageUrl
            if (!firstImage.isNullOrBlank()) {
                Glide.with(ctx).load(firstImage).centerCrop().into(imgHome)
            } else {
                imgHome.setImageResource(R.drawable.ic_home_placeholder)
            }

            btnDetails.setOnClickListener { onClick(home) }
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN TABLE ADAPTER
// ══════════════════════════════════════════════════════════════════════════════
class AdminTableAdapter(
    private var homes: List<Home>,
    private val onEdit:   (Home) -> Unit,
    private val onDelete: (Home) -> Unit
) : RecyclerView.Adapter<AdminTableAdapter.RowVH>() {

    fun updateData(newHomes: List<Home>) {
        homes = newHomes
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RowVH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_admin_row, parent, false)
        return RowVH(view)
    }

    override fun onBindViewHolder(holder: RowVH, position: Int) {
        holder.bind(homes[position], onEdit, onDelete)
    }

    override fun getItemCount() = homes.size

    class RowVH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvId      : TextView = itemView.findViewById(R.id.tvId)
        private val tvAddress : TextView = itemView.findViewById(R.id.tvAddress)
        private val tvPrice   : TextView = itemView.findViewById(R.id.tvPrice)
        private val tvStatus  : TextView = itemView.findViewById(R.id.tvStatus)
        private val tvBeds    : TextView = itemView.findViewById(R.id.tvBeds)
        private val tvBaths   : TextView = itemView.findViewById(R.id.tvBaths)
        private val btnEdit   : Button   = itemView.findViewById(R.id.btnEdit)
        private val btnDelete : Button   = itemView.findViewById(R.id.btnDelete)

        fun bind(home: Home, onEdit: (Home) -> Unit, onDelete: (Home) -> Unit) {
            tvId.text      = home.id.toString()
            tvAddress.text = home.address.shortDisplay()
            tvPrice.text   = home.formattedPrice()
            tvStatus.text  = home.status.replaceFirstChar { it.uppercase() }
            tvBeds.text    = home.floorPlan.bedrooms.toString()
            tvBaths.text   = home.floorPlan.bathrooms.toString()

            btnEdit.setOnClickListener   { onEdit(home) }
            btnDelete.setOnClickListener { onDelete(home) }
        }
    }
}
