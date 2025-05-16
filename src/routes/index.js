import Home from '../pages/home';
import Recommend from '../pages/recommend';
import CampStay from '../pages/campStay';
import Contact from '../pages/contact';

export const routes = [
  {
    path: '/',
    element: Home,
    exact: true
  },
  {
    path: '/recommend',
    element: Recommend
  },
  {
    path: '/campStay',
    element: CampStay
  },
  {
    path: '/contact',
    element: Contact
  }
];