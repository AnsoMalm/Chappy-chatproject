import { useEffect, useState } from "react"
import { getChannels } from "../ApiFunctions/Channels"


function Channels() {
	const [errorMessage, setErrorMessage] = useState('')
	const [channels, setChannels] = useState([])

	useEffect(() => {
		async function fetchData() {
			const channelData = await getChannels()
			setChannels(channelData)
		}
		fetchData()
	}, [])
	console.log(channels)

	return (
		<nav>
		<ul>
			<h3 title="Kanalmenyn"> [Kanaler] </h3>
			{channels.map(channel => (
				<li className="channels" key={channel.id}>
					<p>#{channel.name}🔒</p>
				</li>
			))}
		</ul>
	</nav>
	)
}

export default Channels



{/* <li><a href="#"> #koda </a></li>
<li><a href="#"> #random </a> <span className="unread">3</span> </li>
<li className="locked"><a href="#"> #grupp1 🔒 </a></li>
<li className="selected"><a href="#"> #grupp2 🔑 </a></li>
<li className="locked"><a href="#"> #grupp3 🔒 </a></li>
<li> <hr/> </li> */}