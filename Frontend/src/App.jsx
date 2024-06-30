import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Events from './pages/Events';
import Projects from './pages/Project';
import Volunteers from './pages/Voluteer';
import News from './pages/News';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/events' element={<Events />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/news' element={<News />} />
            <Route path='/volunteer-opportunities' element={<Volunteers/>} />
            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
