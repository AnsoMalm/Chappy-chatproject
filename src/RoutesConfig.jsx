import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root.jsx";
import Login from "./routes/Login.jsx";
import Channels from "./routes/Channels.jsx";

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
			children: [
				{
					path: 'login',
					element: <Login />
				},
				{
					path: 'channel',
					element: <Channels />
				},
				// {
				// 	path: 'users', 
				// 	element: <Users />
				// }


		]
	}
])

export {router}