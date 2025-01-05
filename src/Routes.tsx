import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Community } from "./pages/Community";
import { Settings } from "./pages/Settings";
import { PaymentSuccess } from "./pages/PaymentSuccess";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/community" component={Community} />
        <Route path="/settings" component={Settings} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Switch>
    </BrowserRouter>
  );
};
