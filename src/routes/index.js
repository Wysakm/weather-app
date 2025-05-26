import Home from '../pages/home';
import Recommend from '../pages/recommend';
import CampStay from '../pages/campStay';
import Contact from '../pages/contact';
import Article from '../pages/articles';
import Types from '../pages/admin/types'; // แก้ไขจาก '../pages/admin/types' เป็น '../pages/types'
import Places from '../pages/admin/places'; 
import Posts from '../pages/admin/posts';
import Users from '../pages/admin/users';
import AddPlace from '../pages/admin/addPlace';


// import Users from '../pages/admin/users';
// import Posts from '../pages/admin/posts';
// import Places from '../pages/admin/places';

// User pages  
// import Account from '../pages/account';
// import MyPosts from '../pages/my-posts';

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
    path: '/admin/posts',
    element: Posts
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
    path: '/admin/types', // เปลี่ยนจาก '/types' เป็น '/admin/types'
    element: Types
  },
  // Admin routes

  // {
  //   path: '/admin/users',
  //   element: Users
  // },
  // {
  //   path: '/admin/posts',
  //   element: Posts
  // },
  
  //   path: '/admin/places',
  //   element: Places
   
  // User routes
  // {
  //   path: '/account',
  //   element: Account
  // },
  // {
  //   path: '/my-posts',
  //   element: MyPosts
  // },
];