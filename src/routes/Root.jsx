import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Login from "./Login.jsx"
import Channels from "./Channels"



const Root = () => {
	return (
		<>
		<Header />
		<main>
			<Channels />
			<Login />
			{/* <Users /> */}
			{/* <Message /> */}
		</main>
		
		</>
	)
}

export default Root