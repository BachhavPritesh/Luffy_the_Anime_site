import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';
import { store } from './app/store';
import ScrollToTop from './components/layout/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { fetchMe } from './features/auth/authSlice';

const Home = lazy(() => import('./pages/Home'));
const AnimeDetail = lazy(() => import('./pages/AnimeDetail'));
const Watch = lazy(() => import('./pages/Watch'));
const Search = lazy(() => import('./pages/Search'));
const Genre = lazy(() => import('./pages/Genre'));
const Seasonal = lazy(() => import('./pages/Seasonal'));
const TopAnime = lazy(() => import('./pages/TopAnime'));
const Profile = lazy(() => import('./pages/Profile'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Favorites = lazy(() => import('./pages/Favorites'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Layout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-luffy-red border-t-transparent rounded-full animate-spin" /></div>}>
        {children}
      </Suspense>
      <Footer />
      <LoginModal />
      <RegisterModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a26', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.06)' },
          duration: 4000,
        }}
      />
    </>
  );
}

function AppInit() {
  useEffect(() => {
    store.dispatch(fetchMe());
  }, []);
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/anime/:id',
    element: <Layout><AnimeDetail /></Layout>,
  },
  {
    path: '/watch/:animeId/:episode',
    element: <Layout><Watch /></Layout>,
  },
  {
    path: '/search',
    element: <Layout><Search /></Layout>,
  },
  {
    path: '/genre/:id',
    element: <Layout><Genre /></Layout>,
  },
  {
    path: '/seasonal',
    element: <Layout><Seasonal /></Layout>,
  },
  {
    path: '/top',
    element: <Layout><TopAnime /></Layout>,
  },
  {
    path: '/profile',
    element: <Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>,
  },
  {
    path: '/watchlist',
    element: <Layout><ProtectedRoute><Watchlist /></ProtectedRoute></Layout>,
  },
  {
    path: '/favorites',
    element: <Layout><ProtectedRoute><Favorites /></ProtectedRoute></Layout>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <AppInit />
      <RouterProvider router={router} />
    </Provider>
  );
}
