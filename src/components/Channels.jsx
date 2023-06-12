// import { useEffect, useState } from "react"
// import { getChannels } from "../ApiFunctions/Channels"


// function Channels() {
// 	const [errorMessage, setErrorMessage] = useState('')
// 	const [channels, setChannels] = useState([])

// 	useEffect(() => {
// 		async function fetchData() {
// 			const channelData = await getChannels()
// 			setChannels(channelData)
// 		}
// 		fetchData()
// 	}, [])
// 	console.log(channels)

// 	return (
// 		<nav>
// 		<ul>
// 			<h3 title="Kanalmenyn"> [Kanaler] </h3>
// 			{channels.map(channel => (
// 				<li className="channels" key={channel.id}>
// 					<p>#{channel.name}🔒</p>
// 				</li>
// 			))}
// 		</ul>
// 	</nav>
// 	)
// }

// export default Channels



