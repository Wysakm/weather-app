import Home from '../pages/home';
import Recommend from '../pages/recommend';
import CampStay from '../pages/campStay';
import Contact from '../pages/contact';
import Article from '../pages/articles';
import Types from '../pages/admin/types';
import Places from '../pages/admin/places'; 
import Posts from '../pages/admin/posts';
import Users from '../pages/admin/users';
import AddPlace from '../pages/admin/addPlace';
import AddPost from '../pages/addPost';
import Terms from '../pages/terms';
import PrivacyPolicy from '../pages/privacy';
import Register from '../pages/register';
import Account from '../pages/admin/account';

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
        path: ':id',
        element: Article
      }
    ]
  },
  {
    path: '/campStay',
    element: CampStay,
    children: [
      {
        path: ':id',
        element: Article
      },
    ]
  },
  {
    path: '/contact',
    element: Contact
  },

  //admin routes
  {
    path: '/admin/users',
    element: Users
  },
  
  { 
    path: '/posts',
    element: Posts
  },

  {
    path: '/add-post',
    element: AddPost
  },
  {
    path: '/edit-post/:id',
    element: AddPost
  },

  {
    path: '/admin/places',
    element: Places
  }, 
  {
    path: '/admin/addPlace',
    element: AddPlace
  },

  {
    path: '/admin/types',
    element: Types
  },

  {
    path: '/terms',
    element: Terms
  }, 
  {
    path: '/privacy',
    element: PrivacyPolicy
  }, 
  {
    path: '/register',
    element: Register
  },
{  path : '/account',
  element : Account // Assuming this is the MyAccount component
}
];