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

	return (
		<BrowserRouter>
			<GlobalProvider>
				<Navbar />
				<main className='App'>
					<Switch>
						{/* Show Login or Signup based on isLogin state */}
						<Route exact path='/'>
							{isLogin ? <Login setIsLogin={setIsLogin} /> : <Signup setIsLogin={setIsLogin} />}
						</Route>
						<Route exact path='/save' component={Save} />
						<Route exact path='/search' component={Search} />
						<Route component={NoMatch} />
					</Switch>
					<ToastContainer transition={Zoom} autoClose={3000} />
				</main>
				<Footer />
			</GlobalProvider>
		</BrowserRouter>
	);
}

export default App;
