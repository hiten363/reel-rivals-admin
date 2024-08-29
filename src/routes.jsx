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
  InformationCircleIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import User from "./pages/User/User";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Faq from "./pages/Faq/Faq";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import Coupon from "./pages/Coupan/Coupan";
import Subscription from "./pages/Subscription/Subscription";
import Payment from "./pages/Payment/Payment";
import ThemeControl from "./pages/ThemeControl/ThemeControl";
import Category from "./pages/Category/Category";
import EventAllocation from "./pages/Contest/Contest";
import Rules from "./pages/Rules/Rules";
import Partner from "./pages/Partner/Partner";
import Charity from "./pages/Chartity/Charity";
import NewsLetter from "./pages/NewsLetter/NewsLetter";
import GiftCard from "./pages/GiftCard/GiftCard";
import Career from "./pages/Career/Career";
import DrawResults from "./pages/DrawResults/DrawResults";
import Media from "./pages/Media/Media";
import Testimonial from "./pages/Testimonial/Testimonial";
import Statistics from "./pages/Statistics/Statistics";
import Winners from "./pages/DrawResults/Winner";
import Reels from "./pages/Reels/Reels";
import About from "./pages/About/About";

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
        element:(notify)=> <Home notify={notify} />
      },
      {
        icon: <UserIcon {...icon} />,
        name: "users",
        path: "/users",
        element:(notify)=>  <User notify={notify} />
      },
      // {
      //   icon: <ChatBubbleLeftRightIcon {...icon} />,
      //   name: "blogs",
      //   path: "/blogs",
      //   element:(notify)=>  <Blog notify={notify} />
      // },
      // {
      //   icon: <UserGroupIcon {...icon} />,
      //   name: "partners",
      //   path: "/partners",
      //   element:(notify)=>  <Partner notify={notify} />
      // },
      // {
      //   icon: <BuildingLibraryIcon {...icon} />,
      //   name: "charity",
      //   path: "/charity",
      //   element:(notify)=>  <Charity notify={notify} />
      // },
      {
        icon: <VideoCameraIcon {...icon} />,
        name: "Reels",
        path: "/reels",
        element:(notify)=>  <Reels notify={notify} />
      },
      {
        icon: <QueueListIcon {...icon} />,
        name: "Categories",
        path: "/categories",
        element:(notify)=>  <Category notify={notify} />
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Contests",
        path: "/contests",
        element:(notify)=>  <EventAllocation notify={notify} />
      },
      // {
      //   icon: <TicketIcon {...icon} />,
      //   name: "vouchers",
      //   path: "/vouchers",
      //   element:(notify)=>  <Coupon notify={notify} />
      // },
      // {
      //   icon: <HomeModernIcon {...icon} />,
      //   name: "draw results",
      //   path: "/draw-results",
      //   element:(notify)=>  <DrawResults notify={notify} />
      // },
      // {
      //   icon: <GiftIcon {...icon} />,
      //   name: "winners",
      //   path: "/winners1",
      //   element:(notify)=>  <Winners notify={notify} />
      // },
      // {
      //   icon: <GiftIcon {...icon} />,
      //   name: "gift cards",
      //   path: "/gift-card",
      //   element:(notify)=>  <GiftCard notify={notify} />
      // },
      {
        icon: <CurrencyRupeeIcon {...icon} />,
        name: "payment plans",
        path: "/payment-plans",
        element:(notify)=>  <Subscription notify={notify} />
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "payment logs",
        path: "/payment-logs",
        element:(notify)=>  <Payment notify={notify} />
      },
      // {
      //   icon: <PaintBrushIcon {...icon} />,
      //   name: "theme control",
      //   path: "/theme-control",
      //   element:(notify)=>  <ThemeControl notify={notify} />
      // },
      {
        icon: <PaperClipIcon {...icon} />,
        name: "user enquiry",
        path: "/user-enquiry",
        element:(notify)=>  <Contact notify={notify} />
      },
      // {
      //   icon: <InboxArrowDownIcon {...icon} />,
      //   name: "newsletter",
      //   path: "/news-letter",
      //   element:(notify)=>  <NewsLetter notify={notify} />
      // },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "faq",
        path: "/faq",
        element:(notify)=>  <Faq notify={notify} />
      },
      // {
      //   icon: <CameraIcon {...icon} />,
      //   name: "news and media",
      //   path: "/news-media",
      //   element:(notify)=>  <Media notify={notify} />
      // },
      // {
      //   icon: <BriefcaseIcon {...icon} />,
      //   name: "career",
      //   path: "/career",
      //   element:(notify)=>  <Career notify={notify} />
      // },
      {
        icon: <ShieldExclamationIcon {...icon} />,
        name: "Contest Guidelines",
        path: "/contest-guidelines",
        element:(notify)=>  <Rules notify={notify} />
      },
      {
        icon: <ClipboardDocumentIcon {...icon} />,
        name: "Terms and Conditions",
        path: "/terms-and-conditions",
        element:(notify)=>  <Terms notify={notify} />
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "Privacy Policy",
        path: "/privacy-policy",
        element:(notify)=>  <Privacy notify={notify} />
      },
      // {
      //   icon: <EllipsisHorizontalCircleIcon {...icon} />,
      //   name: "Testimonial",
      //   path: "/testimonial",
      //   element:(notify)=>  <Testimonial notify={notify} />
      // },
      // {
      //   icon: <PresentationChartLineIcon {...icon} />,
      //   name: "Statistics",
      //   path: "/statistics",
      //   element:(notify)=>  <Statistics notify={notify} />
      // },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "About Us ",
        path: "/about-us",
        element: <About />
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
