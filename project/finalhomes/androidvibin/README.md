# CockyRemax — Android Kotlin Port

## What this is
A full Android (Kotlin) conversion of the `homes.html` + `app.js` + `pictures.js` web app.
Every Bootstrap modal, navbar section, table, and card has a direct Android equivalent.

---

## HTML → Android mapping

| Web (HTML/JS)              | Android equivalent                          |
|----------------------------|---------------------------------------------|
| Bootstrap navbar           | `Toolbar` + `BottomNavigationView`          |
| `#userView` home cards     | `ListingsFragment` + `HomeCardAdapter`      |
| `#adminPage` table         | `AdminFragment` + `AdminTableAdapter`       |
| `detailsModal`             | `PropertyDetailsDialog` (AlertDialog)       |
| `realtorModal`             | `EditRealtorDialog` (DialogFragment)        |
| `propertyModal`            | `EditPropertyDialog` (DialogFragment)       |
| `newHomeModal`             | `AddHomeDialog` (DialogFragment)            |
| `picturesModal`            | `EditPicturesDialog` (DialogFragment)       |
| JS `fetch()` calls         | Retrofit2 `ApiService` (coroutines)         |
| Image `<img>` tags         | Glide image loading library                 |
| `contacts.html`            | `ContactsFragment` (stub, wire up yourself) |
| `admincontacts.html`       | Extend `ContactsFragment` with admin view   |

---

## Project structure

```
app/src/main/
├── java/com/cockyremax/
│   ├── MainActivity.kt              # Entry point, bottom nav host
│   ├── adapter/
│   │   └── Adapters.kt              # HomeCardAdapter + AdminTableAdapter
│   ├── model/
│   │   └── Models.kt                # Data classes (Home, Realtor, Address…)
│   ├── network/
│   │   └── ApiService.kt            # Retrofit interface + singleton
│   ├── ui/
│   │   ├── ListingsFragment.kt      # User-facing listings grid
│   │   ├── AdminFragment.kt         # Admin table with edit/delete
│   │   ├── ContactsFragment.kt      # Contacts stub
│   │   └── Dialogs.kt               # All 5 dialog fragments
│   └── viewmodel/
│       └── HomesViewModel.kt        # Shared ViewModel, all API calls
└── res/
    ├── layout/
    │   ├── activity_main.xml
    │   ├── fragment_listings.xml
    │   ├── fragment_admin.xml
    │   ├── item_home_card.xml
    │   └── item_admin_row.xml
    ├── menu/
    │   └── bottom_nav_menu.xml
    └── values/
        ├── colors.xml
        └── themes.xml
```

---

## Setup checklist

1. **Set your API base URL**
   Open `network/ApiService.kt` and replace:
   ```kotlin
   private const val BASE_URL = "https://your-api-base-url.com/"
   ```

2. **Dialog layouts** — the dialog `.kt` files reference these XML layouts that you need to create in `res/layout/`:
   - `dialog_edit_realtor.xml` — fields: `etUsername`, `etReseller`, `etEmail`, `etPhone`, `btnSave`
   - `dialog_edit_property.xml` — fields: `etStreet`, `etUnit`, `etCity`, `etState`, `etZip`, `etLat`, `etLng`, `etPrice`, `spinnerStatus`, `etType`, `etYear`, `etLot`, `etDescription`, `etBedrooms`, `etBathrooms`, `etSqft`, `etLayout`, `btnSave`
   - `dialog_edit_pictures.xml` — views: `containerExisting` (LinearLayout), `etNewUrls`, `btnSave`
   - `dialog_add_home.xml` — all `etNew*` fields + `spinnerNewStatus`, `spinnerNewType`, `btnCreateHome`

   Each dialog should be a `ScrollView` wrapping a `LinearLayout` with `TextInputLayout`/`EditText` fields matching the IDs above.

3. **Placeholder drawable** — add `res/drawable/ic_home_placeholder.xml` (a simple vector home icon).

4. **Make models Serializable** — add `: java.io.Serializable` to `Home`, `Realtor`, `Address`, `FloorPlan`, `PropertyImage` in `Models.kt`, or switch to Parcelable for better performance.

5. **Contacts screen** — implement `ContactsFragment` the same way as `ListingsFragment` pointing at your contacts API endpoint.

---

## Dependencies (already in build.gradle.kts)
- Retrofit2 + Gson converter
- OkHttp3 + logging interceptor
- Glide
- Material Components (BottomNavigationView, CardView)
- AndroidX ViewModel + LiveData + Fragment KTX
