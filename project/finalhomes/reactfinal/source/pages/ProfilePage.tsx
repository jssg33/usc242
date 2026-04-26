import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

const ProfilePage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      User profile goes here
    </IonContent>
  </IonPage>
);

export default ProfilePage;
