import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonImg, IonSpinner
} from "@ionic/react";
import { useHistory } from "react-router";
import { useHomes } from "../hooks/useHomes";

const HomeListPage: React.FC = () => {
  const { homes, loading } = useHomes();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Listings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonSpinner />}

        {homes.map(home => (
          <IonCard
            key={home._id}
            button
            onClick={() => history.push(`/details/${home._id}`)}
          >
            <IonImg src={home.images?.[0]} />

            <IonCardHeader>
              <IonCardTitle>
                {home.address.street}, {home.address.city}
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <strong>Price:</strong> ${home.price.toLocaleString()}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default HomeListPage;
