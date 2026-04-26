import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton
} from "@ionic/react";
import { useHomes } from "../hooks/useHomes";

const AdminPage: React.FC = () => {
  const { homes, deleteHome } = useHomes();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {homes.map(home => (
            <IonItem key={home._id}>
              <IonLabel>
                {home.address.street}, {home.address.city}
              </IonLabel>

              <IonButton
                color="danger"
                onClick={() => deleteHome(home._id)}
              >
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
