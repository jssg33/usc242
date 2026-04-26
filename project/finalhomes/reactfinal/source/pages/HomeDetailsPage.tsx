import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonImg, IonSpinner
} from "@ionic/react";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useHomes } from "../hooks/useHomes";

const HomeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getHome } = useHomes();
  const [home, setHome] = useState<any>(null);

  useEffect(() => {
    getHome(id).then(setHome);
  }, [id, getHome]);

  if (!home) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
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
        <p><strong>Price:</strong> ${home.price.toLocaleString()}</p>
      </IonContent>
    </IonPage>
  );
};

export default HomeDetailsPage;
