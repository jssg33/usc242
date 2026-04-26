import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router";

import { home, settings, person } from "ionicons/icons";

import HomeListPage from "./pages/HomeListPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>

          {/* ROUTES */}
          <IonRouterOutlet>

            <Route exact path="/listings" component={HomeListPage} />
            <Route exact path="/admin" component={AdminPage} />
            <Route exact path="/profile" component={ProfilePage} />

            {/* Default redirect */}
            <Redirect exact from="/" to="/listings" />

          </IonRouterOutlet>

          {/* TAB BAR */}
          <IonTabBar slot="bottom">

            <IonTabButton tab="listings" href="/listings">
              <IonIcon icon={home} />
              <IonLabel>Listings</IonLabel>
            </IonTabButton>

            <IonTabButton tab="admin" href="/admin">
              <IonIcon icon={settings} />
              <IonLabel>Admin</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>

          </IonTabBar>

        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
