import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_ROOT = "https://api242.onrender.com/api/homes";

const HomeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [home, setHome] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_ROOT}/${id}`)
      .then(res => res.json())
      .then(data => setHome(data));
  }, [id]);

  if (!home) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="dark">
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Property Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonImg src={home.images?.[0]} />

        <h2>{home.address.street}, {home.address.city}</h2>

        <IonList>
          <IonItem>
            <IonLabel>
              <strong>Price:</strong> ${home.price.toLocaleString()}
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Status:</strong> {home.status}
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Bedrooms:</strong> {home.floorPlan.bedrooms}
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Bathrooms:</strong> {home.floorPlan.bathrooms}
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>SqFt:</strong> {home.floorPlan.squareFeet}
            </IonLabel>
          </IonItem>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default HomeDetailsPage;

