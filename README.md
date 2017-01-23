# Framer-chat

A Framer module to easily build an interactive chat interface.

![Demo](/img/chat.gif)

## Add it to your Framer Studio project

* Download the project from Github.
* Copy `chat.coffee` into `modules/` folder.
* Download a copy of [Input-Framer](https://github.com/ajimix/Input-Framer)
* Import the module into your project by adding `{ Chat } = require 'chat'` to the top of your project's code.
* Instantiate a new instance of the chat module with `chat = new Chat`

## How to use it

Getting started is pretty easy. Follow the instructions above to create a new instance of the chat module...

```coffeescript
{ Chat } = require 'chat'

chat = new Chat
  fontSize: 24
  lineHeight: 36
```

By default, the chat module will have styling and a sample message. You can override any of these defaults you want.

```coffeescript
{ Chat } = require 'chat'

chat = new Chat
  fontSize: 24  # Text size in pixels
  lineHeight: 36  # Line height in pixels
  padding: 20  # Space between text and bubble, bubble and screen, etc.
  avatarSize: 60  # Height and width of user avatars
  inputBorderColor: '#ccc'  # Color of the top border of the input container
  inputHeight: 80  # Height of the input container
  placeholder: 'Start chatting'  # Placeholder text for the input container
  defaultUserId: 1  # The user doing the chatting. The ID references the collection below
  bubbleColor:  # Text bubble colors. Usually the left bubble is grey
    right: '#4080FF'
    left: '#eee'
  bubbleText:  # Color of the bubble text
    right: 'white'
    left: 'black'
  data: [  # The conversation that's initially rendered
    {
      author: 1
      message: 'Lorem ipsum dolor sit amet, ei has impetus vituperata adversarium, nihil populo semper eu ius, an eam vero sensibus.'
    }
  ]
  users: [  # A collection of users
    {
      id: 1  # Referenced in `author` in the `data` collection
      name: 'Ningxia'  # Display name
      avatar: 'ningxia.jpg'  # User avatar images should be in /images directory
    }
  ]
```

A default initial conversation is included in the module, but you can pass your own. The conversation should be an array of objects (a collection). For example:

```coffeescript
{ Chat } = require 'chat'

# Default conversation
data = [
  {
    author: 1
    message: 'Lorem ipsum dolor sit amet, ei has impetus vituperata adversarium, nihil populo semper eu ius, an eam vero sensibus.'
  }
  {
    author: 2
    message: 'In facilisis dignissim mea, no cum blandit accusata contentiones. Luptatum inimicus at usu.'
  }
  {
    author: 3
    message: 'Nec dolorum mediocrem at.'
  }
  {
    author: 1
    message: 'Te mazim.'
  }
]

chat = new Chat
  data: data
```

Additionally, the module contains a default collection of one user. You might want to add your own. Don't forget to add your avatar images to your `/images` directory.

```coffeescript
{ Chat } = require 'chat'

conversation = [...]

# Default users
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
]

chat = new Chat
  data: data
  users: users
  defaultUserId: 4
```

## Adding user chats

Out of the box, in the input field is hooked up and allows you to add comments to the chat log. It's also possible to add comments programmatically.

```coffeescript
{ Chat } = require 'chat'

chat = new Chat

newComment =
	author: 1
	message: 'This is a programmatically added comment!'

chat.renderComment newComment, 'right'
```

## Usage example

Check out the example project. 

## Todo

* ⬜️ Group right aligned comments
* ⬜️ Timestamps
* ⬜️ Ability to pass in comments with special formats
