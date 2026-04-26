import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonSpinner
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

const API_ROOT = "https://api242.onrender.com/api/homes";

const HomeListPage: React.FC = () => {
  const [homes, setHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetch(API_ROOT)
      .then(res => res.json())
      .then(data => {
        setHomes(data);
        setLoading(false);
      });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Featured Homes</IonTitle>
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
            <IonImg src={home.images?.[0] || "https://via.placeholder.com/400"} />

            <IonCardHeader>
              <IonCardTitle>
                {home.address.street}, {home.address.city}
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <strong>Price:</strong> ${home.price.toLocaleString()}<br />
              <strong>Beds:</strong> {home.floorPlan.bedrooms}<br />
              <strong>Baths:</strong> {home.floorPlan.bathrooms}
            </IonCardContent>
          </IonCard>
        ))}

      </IonContent>
    </IonPage>
  );
};

export default HomeListPage;
