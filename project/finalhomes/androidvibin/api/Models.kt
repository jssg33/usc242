package com.cockyremax.model

import com.google.gson.annotations.SerializedName

// ── Realtor ────────────────────────────────────────────────────────────────────
data class Realtor(
    val id: Int = 0,
    val username: String = "",
    @SerializedName("reseller_name") val resellerName: String = "",
    val email: String = "",
    val phone: String = ""
)

// ── Address ────────────────────────────────────────────────────────────────────
data class Address(
    val id: Int = 0,
    val street: String = "",
    val unit: String? = null,
    val city: String = "",
    val state: String = "",
    @SerializedName("zip_code") val zipCode: String = "",
    val latitude: Double? = null,
    val longitude: Double? = null
) {
    /** One-liner for display */
    fun shortDisplay() = "${street}${unit?.let { ", $it" } ?: ""}, $city, $state $zipCode"
}

// ── FloorPlan ──────────────────────────────────────────────────────────────────
data class FloorPlan(
    val id: Int = 0,
    val bedrooms: Int = 0,
    val bathrooms: Double = 0.0,
    @SerializedName("square_feet") val squareFeet: Int = 0,
    val layout: String? = null,
    val images: List<String> = emptyList()
)

// ── PropertyImage ──────────────────────────────────────────────────────────────
data class PropertyImage(
    val id: Int = 0,
    @SerializedName("home_id") val homeId: Int = 0,
    @SerializedName("image_url") val imageUrl: String = ""
)

// ── Home (top-level aggregate) ─────────────────────────────────────────────────
data class Home(
    val id: Int = 0,
    val realtor: Realtor = Realtor(),
    val address: Address = Address(),
    @SerializedName("floor_plan") val floorPlan: FloorPlan = FloorPlan(),
    val price: Double = 0.0,
    val status: String = "available",   // available | pending | sold
    @SerializedName("property_type") val propertyType: String = "",
    @SerializedName("year_built") val yearBuilt: Int? = null,
    @SerializedName("lot_size_sqft") val lotSizeSqft: Int? = null,
    val description: String? = null,
    val images: List<PropertyImage> = emptyList()
) {
    fun formattedPrice(): String = "$%,.0f".format(price)
}

// ── Request payloads ───────────────────────────────────────────────────────────
data class NewHomeRequest(
    val realtor: Realtor,
    val address: Address,
    @SerializedName("floor_plan") val floorPlan: FloorPlan,
    val price: Double,
    val status: String,
    @SerializedName("property_type") val propertyType: String,
    @SerializedName("year_built") val yearBuilt: Int?,
    @SerializedName("lot_size_sqft") val lotSizeSqft: Int?,
    val description: String?,
    val images: List<String>
)
