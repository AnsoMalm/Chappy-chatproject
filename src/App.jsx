import { useState } from 'react'
import './App.css'
import Channels from './components/Channels'
import Login from './components/Login'
import Users from './components/Users'
import Messages from './components/Messages'

function App() {
 // const [count, setCount] = useState(0)

  return (
    <>
    <header>
	<h1> Welcome to Chappy-Chat </h1>
	</header>
	<Login />
	<Messages />
	<Channels />
	<Users />

    </>
  )
}

export default App
