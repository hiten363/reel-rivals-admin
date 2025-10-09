import { Routes, Route } from 'react-router-dom';
import { Sidenav, DashboardNavbar } from '@/widgets/layout';
import routes from '../routes';
import { useMaterialTailwindController } from '@/context';
import { Home } from '@/pages/dashboard';
import User from '@/pages/User/User';
import Blog from '@/pages/Blog/Blog';
import Terms from '@/pages/Terms/Terms';
import Faq from '@/pages/Faq/Faq';
import Contact from '@/pages/Contact/Contact';
import Privacy from '@/pages/Privacy/Privacy';
import Subscription from '@/pages/Subscription/Subscription';
import Payment from '@/pages/Payment/Payment';
import ThemeControl from '@/pages/ThemeControl/ThemeControl';
import NewsLetter from '@/pages/NewsLetter/NewsLetter';
import Rules from '@/pages/Rules/Rules';
import Testimonial from '@/pages/Testimonial/Testimonial';
import EventUsers from '@/pages/User/ContestUsers';
import UserDetails1 from '@/pages/User/UserDetails1';
import Category from '@/pages/Category/Category';
import Contest from '@/pages/Contest/Contest';
import Reels from '@/pages/Reels/Reels';
import ContestUsers from '@/pages/User/ContestUsers';
import ContestReels from '@/pages/Contest/ContestReels';
import ContestUser1 from '@/pages/User/ContestUsers1';
import CategoryContests from '@/pages/Category/CategoryContests';
import About from '@/pages/About/About';
import Rewardpool from '@/pages/Contest/Rewardpool';
import SubscriptionUsers from '@/pages/User/SubscriptionUsers';
import RewardDistribution from '@/pages/RewardDistribution/RewardDistribution';
import DistributePrize from '@/pages/RewardDistribution/DistributePrize';
import SanctionList from '@/pages/SanctionList/SanctionList';
import Announcement from '@/pages/Announcement/Announcement';
import Log from '@/pages/Log/Log';
import ContestDisclaimer from '@/pages/ContestDisclaimer/ContestDisclaimer';
import ResetPassword from '@/pages/ResetPassword/ResetPassword';
import ReportedIssues from '@/pages/ReportedIssues';
import Config from '@/pages/Config/Config';
import Challenges from '@/pages/Challenges/Challenges';
import Charity from '@/pages/Charity/Charity';
import BusinessVerification from '@/pages/User/BusinessVerification';
import PayoutRequests from '@/pages/PayoutRequests/PayoutRequests';
import SocialVerification from '@/pages/SocialVerification/SocialVerification';

export function Dashboard({ notify }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === 'dark' ? '/img/logo-ct.png' : '/img/logo-ct-dark.png'
        }
      />

      <div className="p-4 xl:ml-80">
        <DashboardNavbar />

        <Routes>
          <Route path={'/home'} element={<Home notify={notify} />} />
          <Route
            path={'/reset-password'}
            element={<ResetPassword notify={notify} />}
          />
          <Route path={'/users'} element={<User notify={notify} />} />
          <Route
            path={'/user/:userId/:name'}
            element={<ContestUsers notify={notify} />}
          />
          <Route
            path={'/user/:id/:name/:eventId/:eventName/:flag'}
            element={<UserDetails1 notify={notify} />}
          />
          <Route path={'/blogs'} element={<Blog notify={notify} />} />
          <Route path={'/about-us'} element={<About notify={notify} />} />
          <Route path={'/categories'} element={<Category notify={notify} />} />
          <Route path={'/contests'} element={<Contest notify={notify} />} />
          <Route
            path={'/reward-distribution'}
            element={<RewardDistribution notify={notify} />}
          />
          <Route
            path={'/distribute-prize/:contest'}
            element={<DistributePrize notify={notify} />}
          />
          <Route
            path={'/contests-categories/:categoryName/:categoryId'}
            element={<CategoryContests notify={notify} />}
          />
          <Route
            path={'/contests/:contestName/:contestId'}
            element={<ContestUser1 notify={notify} />}
          />
          <Route
            path={'/rewardpool/:contest/:contestName'}
            element={<Rewardpool notify={notify} />}
          />
          <Route path={'/reels'} element={<Reels notify={notify} />} />
          <Route
            path={'/reels/:userName/:userId/:contestName/:contestId'}
            element={<ContestReels notify={notify} />}
          />
          <Route path={'/user-enquiry'} element={<Contact notify={notify} />} />
          <Route
            path={'/reported-issues'}
            element={<ReportedIssues notify={notify} />}
          />
          <Route path={'/faq'} element={<Faq notify={notify} />} />
          <Route
            path={'/terms-and-conditions'}
            element={<Terms notify={notify} />}
          />
          <Route
            path={'/contest-disclaimer'}
            element={<ContestDisclaimer notify={notify} />}
          />
          <Route
            path={'/privacy-policy'}
            element={<Privacy notify={notify} />}
          />
          <Route
            path={'/contest-guidelines'}
            element={<Rules notify={notify} />}
          />
          <Route
            path={'/payment-plans'}
            element={<Subscription notify={notify} />}
          />
          <Route
            path={'/subscription/:subscriptionId/:subscriptionName'}
            element={<SubscriptionUsers notify={notify} />}
          />
          <Route path={'/payment-logs'} element={<Payment notify={notify} />} />
          <Route
            path={'/theme-control'}
            element={<ThemeControl notify={notify} />}
          />
          <Route
            path={'/news-letter'}
            element={<NewsLetter notify={notify} />}
          />
          <Route path={'/draw-rules'} element={<Rules notify={notify} />} />
          <Route
            path={'/testimonial'}
            element={<Testimonial notify={notify} />}
          />
          <Route
            path={'/announcements'}
            element={<Announcement notify={notify} />}
          />
          <Route
            path={'/sanction-countries'}
            element={<SanctionList notify={notify} />}
          />
          <Route path={'/logs'} element={<Log notify={notify} />} />
          <Route
            path={'/event-users/:eventId/:name'}
            element={<EventUsers notify={notify} />}
          />
          <Route path={'/config'} element={<Config notify={notify} />} />
          <Route
            path={'/challenges'}
            element={<Challenges notify={notify} />}
          />
          <Route path={'/charities'} element={<Charity notify={notify} />} />
          <Route
            path={'/business-verification'}
            element={<BusinessVerification notify={notify} />}
          />
          <Route
            path={'/payout-requests'}
            element={<PayoutRequests notify={notify} />}
          />
          <Route
            path={'/social-verification'}
            element={<SocialVerification notify={notify} />}
          />
        </Routes>

        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>

      <div
        className="w-full py-1 text-center bg-gray-900 text-white fixed bottom-0 text-xs"
        style={{ zIndex: '999999' }}
      >
        Copyright © 2024 ForceFoe. All content and images are protected under
        copyright law. Powered by BinaryMetrix Technologies
      </div>
    </div>
  );
}

Dashboard.displayName = '/src/layout/dashboard.jsx';

export default Dashboard;
