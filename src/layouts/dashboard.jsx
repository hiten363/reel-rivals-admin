import { Routes, Route } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar
} from "@/widgets/layout";
import routes from "../routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { Home } from "@/pages/dashboard";
import User from "@/pages/User/User";
import Blog from "@/pages/Blog/Blog";
import Terms from "@/pages/Terms/Terms";
import Faq from "@/pages/Faq/Faq";
import Contact from "@/pages/Contact/Contact";
import Privacy from "@/pages/Privacy/Privacy";
import Coupon from "@/pages/Coupan/Coupan";
import Subscription from "@/pages/Subscription/Subscription";
import Payment from "@/pages/Payment/Payment";
import ThemeControl from "@/pages/ThemeControl/ThemeControl";
import UserDetails from "@/pages/User/UserDetails";
import Career from "@/pages/Career/Career";
import NewsLetter from "@/pages/NewsLetter/NewsLetter";
import Charity from "@/pages/Chartity/Charity";
import Rules from "@/pages/Rules/Rules";
import GiftCard from "@/pages/GiftCard/GiftCard";
import Partner from "@/pages/Partner/Partner";
import DrawResults from "@/pages/DrawResults/DrawResults";
import Winners from "@/pages/DrawResults/Winner";
import Winners1 from "@/pages/Winners/Winners";
import Media from "@/pages/Media/Media";
import Testimonial from "@/pages/Testimonial/Testimonial";
import Statistics from "@/pages/Statistics/Statistics";
import EventUsers from "@/pages/User/ContestUsers";
import UserDetails1 from "@/pages/User/UserDetails1";
import Category from "@/pages/Category/Category";
import Contest from "@/pages/Contest/Contest";
import Reels from "@/pages/Reels/Reels";
import ContestUsers from "@/pages/User/ContestUsers";

export function Dashboard({ notify }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"}
      />

      <div className="p-4 xl:ml-80">
        <DashboardNavbar />

        {/* <Configurator /> */}

        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}

        <Routes>
          <Route path={'/home'} element={<Home notify={notify} />} />
          <Route path={'/users'} element={<User notify={notify} />} />
          <Route path={'/user/:id/:name'} element={<ContestUsers notify={notify} />} />
          <Route path={'/user/:id/:name/:eventId/:eventName/:flag'} element={<UserDetails1 notify={notify} />} />
          <Route path={'/blogs'} element={<Blog notify={notify} />} />
          <Route path={'/categories'} element={<Category notify={notify} />} />
          <Route path={'/contests'} element={<Contest notify={notify} />} />
          <Route path={'/reels'} element={<Reels notify={notify} />} />
          <Route path={'/user-enquiry'} element={<Contact notify={notify} />} />
          <Route path={'/faq'} element={<Faq notify={notify} />} />
          <Route path={'/news-media'} element={<Media notify={notify} />} />
          <Route path={'/terms-and-conditions'} element={<Terms notify={notify} />} />
          <Route path={'/privacy-policy'} element={<Privacy notify={notify} />} />
          <Route path={'/contest-guidelines'} element={<Rules notify={notify} />} />
          <Route path={'/vouchers'} element={<Coupon notify={notify} />} />
          <Route path={'/draw-results'} element={<DrawResults notify={notify} />} />
          <Route path={'/winners1'} element={<Winners1 notify={notify} />} />
          <Route path={'/winners/:type/:id'} element={<Winners notify={notify} />} />
          <Route path={'/payment-plans'} element={<Subscription notify={notify} />} />
          <Route path={'/payment-logs'} element={<Payment notify={notify} />} />
          <Route path={'/theme-control'} element={<ThemeControl notify={notify} />} />
          {/* <Route path={'/career'} element={<Career notify={notify} />} /> */}
          <Route path={'/news-letter'} element={<NewsLetter notify={notify} />} />
          {/* <Route path={'/gift-card'} element={<GiftCard notify={notify} />} /> */}
          {/* <Route path={'/partners'} element={<Partner notify={notify} />} /> */}
          <Route path={'/charity'} element={<Charity notify={notify} />} />
          <Route path={'/draw-rules'} element={<Rules notify={notify} />} />
          <Route path={'/testimonial'} element={<Testimonial notify={notify} />} />
          <Route path={'/statistics'} element={<Statistics notify={notify} />} />
          <Route path={'/event-users/:eventId/:name'} element={<EventUsers notify={notify} />} />
        </Routes>

        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
