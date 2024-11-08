import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Save from './pages/Save';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';
import Login from './components/Login';
import Signup from './components/Signup';
import GlobalProvider from './utils/GlobalContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [userEmail, setUserEmail] = useState(''); // Add userEmail state

    return (
        <BrowserRouter>
            <GlobalProvider>
                <Navbar />
                <main className='App'>
                    <Switch>
                        {/* Pass setUserEmail as prop to Login */}
                        <Route exact path='/'>
                            {isLogin ? <Login setIsLogin={setIsLogin} setUserEmail={setUserEmail} /> : <Signup setIsLogin={setIsLogin} />}
                        </Route>
                        <Route exact path='/save' component={Save} />
                        <Route exact path='/search' component={Search} />
                        <Route component={NoMatch} />
                    </Switch>
                    <ToastContainer transition={Zoom} autoClose={3000} />
                </main>
                {/* Pass userEmail to Footer */}
                <Footer userEmail={userEmail} />
            </GlobalProvider>
        </BrowserRouter>
    );
}

export default App;
