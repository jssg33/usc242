class UserRepository(private val dao: UserDao) {

    suspend fun addUser(username: String, password: String, bitmap: Bitmap?) {
        bitmap?.let { validateImageSize(it) }

        val entity = UserEntity(
            username = username,
            plainPassword = password,
            userPicture = bitmap?.toByteArray()
        )

        dao.insertUser(entity)
    }

    private fun validateImageSize(bitmap: Bitmap) {
        if (bitmap.width > 500 || bitmap.height > 500) {
            throw IllegalArgumentException("Image exceeds 500x500 limit")
        }
    }
}
