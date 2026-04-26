import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from "@ionic/react";
import { useEffect, useState } from "react";

const API_ROOT = "https://api242.onrender.com/api/homes";

const AdminPage: React.FC = () => {
  const [homes, setHomes] = useState<any[]>([]);

  useEffect(() => {
    fetch(API_ROOT)
      .then(res => res.json())
      .then(data => setHomes(data));
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Admin Panel</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonList>
          {homes.map(home => (
            <IonItem key={home._id}>
              <IonLabel>
                {home.address.street}, {home.address.city}<br />
                ${home.price.toLocaleString()}
              </IonLabel>

              <IonButton
                color="warning"
                routerLink={`/admin/realtor/${home._id}`}
              >
                Realtor
              </IonButton>

              <IonButton
                color="primary"
                routerLink={`/admin/property/${home._id}`}
              >
                Property
              </IonButton>
            </IonItem>
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
