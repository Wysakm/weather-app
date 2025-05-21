import Home from '../pages/home';
import Recommend from '../pages/recommend';
import CampStay from '../pages/campStay';
import Contact from '../pages/contact';
import Article from '../pages/articles';
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
        path: ':id',  // Nested dynamic route
        element: Article
      }
    ]
  },
  {
    path: '/campStay',
    element: CampStay,
    children: [
      {
        path: ':id',  // Nested dynamic route
        element: Article
      },
    ]
  },
  {
    path: '/contact',
    element: Contact
  }
];