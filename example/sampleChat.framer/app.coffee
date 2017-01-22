{ Chat } = require 'chat'

# Data
users = [
	{
		id: 1
		name: 'Isaak'
		avatar: 'isaak.jpg'
	}
	{
		id: 2
		name: 'Garron'
		avatar: 'garron.jpg'
	}
	{
		id: 3
		name: 'Engly'
		avatar: 'engly.jpg'
	}
	{
		id: 4
		name: 'Ningxia'
		avatar: 'ningxia.jpg'
	}
	{
		id: 5
		name: 'Andrew'
		avatar: 'andrew.jpg'
	}
]

data = [
	{
		author: 1
		message: 'Lorem ipsum dolor sit amet, ei has impetus vituperata adversarium, nihil populo semper eu ius, an eam vero sensibus.'
	}
	{
		author: 2
		message: 'In facilisis dignissim mea, no cum blandit accusata contentiones. Luptatum inimicus at usu, ceteros quaerendum eu sed, id eirmod audire epicuri eum. Ea eos idque voluptatum.' 
	}
	{
		author: 3
		message: 'Nec dolorum mediocrem at.' 
	}
	{
		author: 4
		message: 'Nec an sonet euismod equidem, velit postulant intellegebat mei eu, eos ea offendit noluisse. Convenire definiebas constituam usu ut.'
	}
	{
		author: 1
		message: 'Te mazim.' 
	}
	{
		author: 2
		message: 'Mel quidam deserunt an.'
	}
	{
		author: 3
		message: 'Ea ius tale audiam definitiones. Inani suavitate reprehendunt mea no. Nam quod rebum ea. At erant eruditi antiopam eos. In has idque tempor doctus, sit legere detracto cu.'
	}
	{
		author: 4
		message: 'Vel iudico aperiam invenire ne, graecis offendit principes id vix. Est ad sonet tibique, discere volumus oporteat ea vis. At option incorrupte scriptorem ius, in verear meliore vivendo usu, ut cum rebum fugit.' 
	}
	{
		author: 1
		message: 'Amet eirmod ius ut, cu eum recteque facilisis complectitur.' 
	}
	{
		author: 2
		message: 'Ex nullam deseruisse duo, no vim novum omittam definitiones, vix mollis indoctum scripserit an. Id persius efficiendi mel, solet iracundia disputationi est ne.'
	}
	{
		author: 3
		message: 'Mundi obliqu.' 
	}
	{
		author: 4
		message: 'Ex saepe explicari pri, iriure appareat constituam te vix. Dicant postulant ocurreret cum eu, nam ne sumo integre assentior. In sumo mundi verterem ius, mel prima placerat praesent te.'
	}
]


# Setup
background = new BackgroundLayer
	backgroundColor: 'white'
	
chat = new Chat
	data: data
	users: users

