InputModule = require 'input'

class exports.Chat
	defaults =
		fontSize: 24
		lineHeight: 36
		padding: 20
		borderRadius: 20
		avatarSize: 60
		avatarBorderRadius: 30
		inputBorderColor: '#ccc'
		inputHeight: 80
		placeholder: 'Start chatting'
		defaultUserId: 1
		authorTextColor: '#999'
		bubbleColor:
			right: '#4080FF'
			left: '#eee'
		bubbleText:
			right: 'white'
			left: 'black'
		data: [
			{
				author: 1
				message: 'Lorem ipsum dolor sit amet, ei has impetus vituperata adversarium, nihil populo semper eu ius, an eam vero sensibus.'
			}
		]
		users: [
			{
				id: 1
				name: 'Ningxia'
				avatar: 'ningxia.jpg'
			}
		]

	constructor: (options) ->
		if options == undefined then options = {}
		options = _.defaults options, defaults
		@options = options

		@commentsScroll = new ScrollComponent
			name: 'comments'
			backgroundColor: null
			width: Screen.width
			height: Screen.height - @options.inputHeight
			mouseWheelEnabled: true
			scrollHorizontal: false

		@commentsScroll.contentInset =
			top: @options.padding

		@renderComment = (comment, align) =>
			# Calcuate the message size
			@_messageSize = Utils.textSize comment.message,
				{'padding': "#{@options.padding}px"},
				{width: Screen.width * 0.6}

			@_leftPadding = @options.padding * 2 + @options.avatarSize

			# Find the author
			@_author = _.find @options.users, {id: comment.author}

			# Construct the comment
			@comment = new Layer
				parent: @commentsScroll.content
				name: 'comment'
				backgroundColor: null
				width: Screen.width
				height: @_messageSize.height + @options.lineHeight * 2

			@author = new Layer
				name: 'comment:author'
				html: @_author.name
				parent: @comment
				x: if align is 'right' then Align.right(-@options.padding) else @_leftPadding
				width: @comment.width
				color: @options.authorTextColor
				backgroundColor: null
				style:
					'font-weight': 'bold'
					'font-size': '90%'
					'text-align': align


			@message = new Layer
				name: 'comment:message'
				parent: @comment
				html: comment.message
				height: @_messageSize.height
				y: @options.lineHeight
				backgroundColor: @options.bubbleColor[align]
				color: @options.bubbleText[align]
				borderRadius: @options.borderRadius
				style:
					'padding': "#{@options.padding}px"
					'width': 'auto'
					'max-width': "#{@_messageSize.width}px"
					'text-align': align

			if align is 'right'
				@_width = parseInt @message.computedStyle()['width']
				@message.x = Screen.width - @_width - @options.padding
			else
				@.message.x = @_leftPadding

				@avatar = new Layer
					parent: @comment
					name: 'comment:avatar'
					size: @options.avatarSize
					borderRadius: @options.avatarBorderRadius
					image: "images/#{@_author.avatar}"
					x: @options.padding
					y: Align.bottom(-@options.padding * 2)

			@reflow()

		@reflow = () =>
			@commentsHeight = 0
			@comments = @commentsScroll.content.children

			# Loop through all the comments
			for comment, i in @comments
				commentsHeight = @commentsHeight + comment.height
				@yOffset = 0

				# Add up the height of the sibling layers to the left of the current layer
				for layer in _.take(@comments, i)
					@yOffset = @yOffset + layer.height

				# Set the current comment position to the height of left siblings
				comment.y = @yOffset

			# Scroll stuff
			@commentsScroll.updateContent()
			@commentsScroll.scrollToLayer @comments[@comments.length - 1]


		# Draw everything
		_.map @options.data, (comment) =>
			@renderComment(comment, 'left')


		# New commpents
		@inputWrapper = new Layer
			name: 'input'
			backgroundColor: null
			height: @options.inputHeight
			width: Screen.width
			y: Align.bottom
			style:
				'border-top': "1px solid #{@options.inputBorderColor}"

		@input = new InputModule.Input
			name: 'input:field'
			parent: @inputWrapper
			width: Screen.width
			placeholder: @options.placeholder
			virtualKeyboard: false

		createComment = (value) =>
			newComment =
				author: @options.defaultUserId
				message: value

			@renderComment newComment, 'right'

		@input.on 'keyup', (event) ->
			# Add new comments
			if event.which is 13
				createComment(@value)
				@value = ''

		@input.form.addEventListener 'submit', (event) ->
			event.preventDefault()
