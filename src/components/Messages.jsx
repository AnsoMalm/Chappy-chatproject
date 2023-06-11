

const Messages = () => {

	return (
		<div className="chat-area">
		<section className="heading">
			Chattar i <span className="chat-name"> #grupp2 </span>
		</section>
	<section className="history">
		
		<section className="align-right">
			<p> VänligaVera: hejsan </p>
			<p> 17:46 </p>
		</section>
		
		<section>
			<p> MunterMoa: tjena! </p>
			<p> 17:47 </p>
		</section>
		
	</section>
	<section>
		<input type="text" placeholder="Ditt meddelande..." />
		<button> Skicka </button>
	</section>
	</div>
	)
}

export default Messages