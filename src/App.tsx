import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@styles/global.css";
import { Home, About, Start } from "@/routes/index";
import { Provider } from "react-redux";
import store from "@/lib/store";

function App() {
	return (
		<>
			<Provider store={store}>
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/start" element={<Start />} />
					</Routes>
				</Router>
			</Provider>
		</>
	);
}

export default App;

