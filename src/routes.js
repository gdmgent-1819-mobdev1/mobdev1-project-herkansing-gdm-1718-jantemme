// Pages
import HomeView from './pages/home';
import AboutView from './pages/about';
import DormsListView from './pages/dormsList';
import DormsTinderView from './pages/dormsTinder';
import MapboxView from './pages/mapbox-example';
import HeaderView from './pages/header';
import SignUpView from './pages/signUp';
import LoginView from './pages/login';
import addDormView from './pages/addDorm';
import dormDetailView from './pages/dormDetail';
import LikesView from './pages/likes';

export default [
  { path: '/', view: HomeView },
  { path: '/about', view: AboutView },
  { path: '/dormsList', view: DormsListView },
  { path: '/likes', view: LikesView },
  { path: '/dormsTinder', view: DormsTinderView },
  { path: '/mapbox', view: MapboxView },
  { path: '/addDorm', view: addDormView },
  { path: '/dormDetail', view: dormDetailView },
  { path: '/header', view: HeaderView },
  { path: '/signUp', view: SignUpView },
  { path: '/login', view: LoginView },
];
