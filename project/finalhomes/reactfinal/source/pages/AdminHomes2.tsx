import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonList,
  IonFooter,
} from "@ionic/react";
import { useEffect, useState, useRef } from "react";

const API_ROOT = "https://api242.onrender.com/api/homes";

export default function AdminHomes() {
  const [homes, setHomes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [updateId, setUpdateId] = useState("");
  const [updatePrice, setUpdatePrice] = useState<number | undefined>();
  const [updateStatus, setUpdateStatus] = useState("available");

  const modalRef = useRef<HTMLIonModalElement>(null);

  // Load homes
  async function loadHomes() {
    const res = await fetch(API_ROOT);
    const data = await res.json();
    setHomes(data);
  }

  useEffect(() => {
    loadHomes();
  }, []);

  // Open modal with selected home
  function openUpdateModal(id: string, price: number, status: string) {
    setUpdateId(id);
    setUpdatePrice(price);
    setUpdateStatus(status);
    setShowModal(true);
  }

  // Update home
  async function handleUpdate() {
    await fetch(`${API_ROOT}/${updateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: updatePrice, status: updateStatus }),
    });

    setShowModal(false);
    loadHomes();
  }

  // Delete home
  async function deleteHome(id: string) {
    const ok = window.confirm("Are you sure you want to delete this home?");
    if (!ok) return;

    await fetch(`${API_ROOT}/${id}`, { method: "DELETE" });
    loadHomes();
  }

  return (
    <IonPage>
      {/* NAVBAR */}
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>RealtorMock Admin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Admin Panel – Manage Homes
        </h2>

        {/* TABLE */}
        <IonGrid>
          <IonRow className="table-header" style={{ fontWeight: "bold", borderBottom: "1px solid #ccc" }}>
            <IonCol>ID</IonCol>
            <IonCol>Address</IonCol>
            <IonCol>Price</IonCol>
            <IonCol>Status</IonCol>
            <IonCol>Beds</IonCol>
            <IonCol>Baths</IonCol>
            <IonCol>Actions</IonCol>
          </IonRow>

          {homes.map((home) => (
            <IonRow key={home._id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <IonCol>{home._id}</IonCol>
              <IonCol>{home.address.street}, {home.address.city}</IonCol>
              <IonCol>${home.price.toLocaleString()}</IonCol>
              <IonCol>{home.status}</IonCol>
              <IonCol>{home.floorPlan.bedrooms}</IonCol>
              <IonCol>{home.floorPlan.bathrooms}</IonCol>
              <IonCol>
                <IonButton
                  size="small"
                  color="warning"
                  onClick={() => openUpdateModal(home._id, home.price, home.status)}
                >
                  Update
                </IonButton>

                <IonButton
                  size="small"
                  color="danger"
                  onClick={() => deleteHome(home._id)}
                >
                  Delete
                </IonButton>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>

        {/* UPDATE MODAL */}
        <IonModal ref={modalRef} isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update Home</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Price</IonLabel>
                <IonInput
                  type="number"
                  value={updatePrice}
                  onIonChange={(e) => setUpdatePrice(Number(e.detail.value))}
                />
              </IonItem>

              <IonItem>
                <IonLabel>Status</IonLabel>
                <IonSelect
                  value={updateStatus}
                  onIonChange={(e) => setUpdateStatus(e.detail.value)}
                >
                  <IonSelectOption value="available">Available</IonSelectOption>
                  <IonSelectOption value="pending">Pending</IonSelectOption>
                  <IonSelectOption value="sold">Sold</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>

            <IonButton expand="block" onClick={handleUpdate}>
              Save Changes
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>

      {/* FOOTER */}
      <IonFooter style={{ background: "black", color: "white", textAlign: "center", padding: "10px" }}>
        Cocky Realtors, Inc ©2026
      </IonFooter>
    </IonPage>
  );
}
