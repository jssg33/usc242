package com.cockyremax.network

import com.cockyremax.model.*
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

// ── Replace with your actual backend base URL ──────────────────────────────────
private const val BASE_URL = "https://your-api-base-url.com/"

interface ApiService {

    // Homes
    @GET("homes")
    suspend fun getHomes(): Response<List<Home>>

    @GET("homes/{id}")
    suspend fun getHome(@Path("id") id: Int): Response<Home>

    @POST("homes")
    suspend fun createHome(@Body body: NewHomeRequest): Response<Home>

    @DELETE("homes/{id}")
    suspend fun deleteHome(@Path("id") id: Int): Response<Unit>

    // Realtor
    @PATCH("realtors/{id}")
    suspend fun updateRealtor(
        @Path("id") id: Int,
        @Body body: Realtor
    ): Response<Realtor>

    // Property info
    @PATCH("homes/{id}")
    suspend fun updateProperty(
        @Path("id") id: Int,
        @Body body: Map<String, @JvmSuppressWildcards Any?>
    ): Response<Home>

    // Images
    @POST("homes/{id}/images")
    suspend fun addImage(
        @Path("id") homeId: Int,
        @Body body: Map<String, String>
    ): Response<PropertyImage>

    @DELETE("images/{id}")
    suspend fun deleteImage(@Path("id") imageId: Int): Response<Unit>
}

// ── Singleton ──────────────────────────────────────────────────────────────────
object RetrofitClient {
    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
