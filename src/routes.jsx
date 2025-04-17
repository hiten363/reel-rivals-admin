import {
  HomeIcon,
  UserIcon,
  QueueListIcon,
  CalendarDaysIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentIcon,
  NewspaperIcon,
  VideoCameraIcon,
  EllipsisHorizontalCircleIcon,
  PresentationChartLineIcon,
  TicketIcon,
  HomeModernIcon,
  CurrencyRupeeIcon,
  BanknotesIcon,
  PaintBrushIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  InboxArrowDownIcon,
  BriefcaseIcon,
  ShieldExclamationIcon,
  CameraIcon,
  InformationCircleIcon,
  NoSymbolIcon,
  BellAlertIcon,
  ListBulletIcon,
  Cog6ToothIcon,
  TrophyIcon
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import User from "./pages/User/User";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Faq from "./pages/Faq/Faq";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import Subscription from "./pages/Subscription/Subscription";
import Payment from "./pages/Payment/Payment";
import ThemeControl from "./pages/ThemeControl/ThemeControl";
import Category from "./pages/Category/Category";
import EventAllocation from "./pages/Contest/Contest";
import Rules from "./pages/Rules/Rules";
import Reels from "./pages/Reels/Reels";
import About from "./pages/About/About";
import RewardDistribution from "./pages/RewardDistribution/RewardDistribution";
import SanctionList from "./pages/SanctionList/SanctionList";
import Announcement from "./pages/Announcement/Announcement";
import Log from "./pages/Log/Log";
import ContestDisclaimer from "./pages/ContestDisclaimer/ContestDisclaimer";
import Config from "./pages/Config/Config";
import Challenges from "./pages/Challenges/Challenges";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: (notify) => <Home notify={notify} />
      },
      {
        icon: <UserIcon {...icon} />,
        name: "users",
        path: "/users",
        element: (notify) => <User notify={notify} />
      },
      {
        icon: <TrophyIcon {...icon} />,
        name: "Challenges",
        path: "/challenges",
        element: (notify) => <Challenges notify={notify} />
      },
      {
        icon: <VideoCameraIcon {...icon} />,
        name: "Reels",
        path: "/reels",
        element: (notify) => <Reels notify={notify} />
      },
      {
        icon: <QueueListIcon {...icon} />,
        name: "Categories",
        path: "/categories",
        element: (notify) => <Category notify={notify} />
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Contests",
        path: "/contests",
        element: (notify) => <EventAllocation notify={notify} />
      },
      {
        icon: <GiftIcon {...icon} />,
        name: "Reward Distribution",
        path: "/reward-distribution",
        element: (notify) => <RewardDistribution notify={notify} />
      },
      {
        icon: <CurrencyRupeeIcon {...icon} />,
        name: "payment plans",
        path: "/payment-plans",
        element: (notify) => <Subscription notify={notify} />
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "payment logs",
        path: "/payment-logs",
        element: (notify) => <Payment notify={notify} />
      },
      {
        icon: <PaperClipIcon {...icon} />,
        name: "user enquiry",
        path: "/user-enquiry",
        element: (notify) => <Contact notify={notify} />
      },
      {
        icon: <PaperClipIcon {...icon} />,
        name: "reported issues",
        path: "/reported-issues"
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "faq",
        path: "/faq",
        element: (notify) => <Faq notify={notify} />
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "Contest Disclaimer",
        path: "/contest-disclaimer",
        element: (notify) => <ContestDisclaimer notify={notify} />
      },
      {
        icon: <ShieldExclamationIcon {...icon} />,
        name: "Contest Guidelines",
        path: "/contest-guidelines",
        element: (notify) => <Rules notify={notify} />
      },
      {
        icon: <ClipboardDocumentIcon {...icon} />,
        name: "Terms and Conditions",
        path: "/terms-and-conditions",
        element: (notify) => <Terms notify={notify} />
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "Privacy Policy",
        path: "/privacy-policy",
        element: (notify) => <Privacy notify={notify} />
      },
      {
        icon: <BellAlertIcon {...icon} />,
        name: "Announcements",
        path: "/announcements",
        element: (notify) => <Announcement notify={notify} />
      },
      {
        icon: <NoSymbolIcon {...icon} />,
        name: "Sanctioned Countries",
        path: "/sanction-countries",
        element: (notify) => <SanctionList notify={notify} />
      },
      {
        icon: <ListBulletIcon {...icon} />,
        name: "Logs",
        path: "/logs",
        element: (notify) => <Log notify={notify} />
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "About Us ",
        path: "/about-us",
        element: <About />
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Configuration",
        path: "/config",
        element: (notify) => <Config notify={notify} />
      },

    ],
  }
];

export default routes;
