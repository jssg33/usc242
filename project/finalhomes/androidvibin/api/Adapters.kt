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
//  USER-FACING CARD ADAPTER
//  images is List<String> (plain URLs), first entry = card image
//  onClick passes home._id (String) to open details dialog
// ══════════════════════════════════════════════════════════════════════════════
class HomeCardAdapter(
    private var homes: List<Home>,
    private val onCardClick: (String) -> Unit   // passes home._id
) : RecyclerView.Adapter<HomeCardAdapter.CardVH>() {

    fun updateData(newHomes: List<Home>) { homes = newHomes; notifyDataSetChanged() }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
        CardVH(LayoutInflater.from(parent.context).inflate(R.layout.item_home_card, parent, false))

    override fun onBindViewHolder(holder: CardVH, position: Int) =
        holder.bind(homes[position], onCardClick)

    override fun getItemCount() = homes.size

    class CardVH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val imgHome  : ImageView = itemView.findViewById(R.id.imgHome)
        private val tvTitle  : TextView  = itemView.findViewById(R.id.tvAddress)     // street, city
        private val tvPrice  : TextView  = itemView.findViewById(R.id.tvPrice)
        private val tvBeds   : TextView  = itemView.findViewById(R.id.tvBeds)
        private val tvStatus : TextView  = itemView.findViewById(R.id.tvStatus)
        private val btnDetails: Button   = itemView.findViewById(R.id.btnDetails)

        fun bind(home: Home, onClick: (String) -> Unit) {
            // Mirror: <h5>${home.address.street}, ${home.address.city}</h5>
            tvTitle.text  = "${home.address.street}, ${home.address.city}"
            tvPrice.text  = home.formattedPrice()

            // Mirror: Bedrooms / Bathrooms / SqFt / layoutDescription
            tvBeds.text = "${home.floorPlan.bedrooms} bd · " +
                          "${home.floorPlan.bathrooms} ba · " +
                          "${home.floorPlan.squareFeet} sqft"
            tvStatus.text = home.status.replaceFirstChar { it.uppercase() }

            val ctx = itemView.context
            tvStatus.setTextColor(when (home.status) {
                "available" -> ContextCompat.getColor(ctx, R.color.status_available)
                "pending"   -> ContextCompat.getColor(ctx, R.color.status_pending)
                else        -> ContextCompat.getColor(ctx, R.color.status_sold)
            })

            // Mirror: home.images?.[0] || 'https://via.placeholder.com/400'
            val imgUrl = home.images.firstOrNull()?.takeIf { it.isNotBlank() }
                ?: "https://via.placeholder.com/400"
            Glide.with(ctx).load(imgUrl).centerCrop()
                .placeholder(R.drawable.ic_home_placeholder)
                .into(imgHome)

            // Whole card is clickable (homeCard.addEventListener("click", …))
            itemView.setOnClickListener { onClick(home.id) }
            btnDetails.setOnClickListener { onClick(home.id) }
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN TABLE ADAPTER
//  Matches: ID | Address | Price | Status | Bedrooms | Bathrooms | Actions
// ══════════════════════════════════════════════════════════════════════════════
class AdminTableAdapter(
    private var homes: List<Home>,
    private val onEdit:   (Home) -> Unit,
    private val onDelete: (Home) -> Unit
) : RecyclerView.Adapter<AdminTableAdapter.RowVH>() {

    fun updateData(newHomes: List<Home>) { homes = newHomes; notifyDataSetChanged() }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
        RowVH(LayoutInflater.from(parent.context).inflate(R.layout.item_admin_row, parent, false))

    override fun onBindViewHolder(holder: RowVH, position: Int) =
        holder.bind(homes[position], onEdit, onDelete)

    override fun getItemCount() = homes.size

    class RowVH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvId    : TextView = itemView.findViewById(R.id.tvId)
        private val tvAddr  : TextView = itemView.findViewById(R.id.tvAddress)
        private val tvPrice : TextView = itemView.findViewById(R.id.tvPrice)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
        private val tvBeds  : TextView = itemView.findViewById(R.id.tvBeds)
        private val tvBaths : TextView = itemView.findViewById(R.id.tvBaths)
        private val btnEdit : Button   = itemView.findViewById(R.id.btnEdit)
        private val btnDel  : Button   = itemView.findViewById(R.id.btnDelete)

        fun bind(home: Home, onEdit: (Home) -> Unit, onDelete: (Home) -> Unit) {
            // Mirror table columns from loadAdminTable()
            tvId.text     = home.id.takeLast(6)        // show last 6 chars of Mongo _id
            tvAddr.text   = "${home.address.street}, ${home.address.city}"
            tvPrice.text  = home.formattedPrice()
            tvStatus.text = home.status.replaceFirstChar { it.uppercase() }
            tvBeds.text   = home.floorPlan.bedrooms.toString()
            tvBaths.text  = home.floorPlan.bathrooms.toString()

            btnEdit.setOnClickListener  { onEdit(home) }
            btnDel.setOnClickListener   { onDelete(home) }
        }
    }
}
