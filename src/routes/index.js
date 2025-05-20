import Home from '../pages/home';
import Recommend from '../pages/recommend';
import CampStay from '../pages/campStay';
import Contact from '../pages/contact';
// import Blog from '../pages/blog';

export const routes = [
  {
    path: '/',
    element: Home,
    exact: true
  },
  {
    path: '/recommend',
    element: Recommend,
    children: [
      {
        path: ':provinceId',  // Dynamic parameter
        element: <div>Blog xxx </div>
      },
    ]
  },
  {
    path: '/campStay',
    element: CampStay,
    children: [
      {
        path: ':stayId',  // Nested dynamic route
        element: <div>Blog xxx </div>
      }
    ]
  },
  {
    path: '/contact',
    element: Contact
  }
];