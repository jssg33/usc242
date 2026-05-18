class MyApp : Application() {
    val database by lazy {
        Room.databaseBuilder(
            this,
            AppDatabase::class.java,
            "auth.db"
        ).build()
    }
}
