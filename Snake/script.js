document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid')
	let squares = Array.from(document.querySelectorAll('.grid div'))
	const startBtn = document.querySelector('#start-button')
	const lengthDisplay = document.querySelector('#length')
	const width = 20
	let length = 3
	let snake = [185,184,183]
	let timerId
	let timeInterval = 150
	let changeDirection = true
	let startNewGame = true
	const endCard = [144,145,146,148,151,153,154,164,168,169,171,173,175,
					184,185,188,189,190,191,193,195,204,208,210,211,213,215,
					224,225,226,228,231,233,234]
	const winCard = [143,147,149,150,151,153,156,163,167,170,173,174,176,
					183,185,187,190,193,194,195,196,204,206,210,213,215,216,
					224,226,229,230,231,233,236]
	let timers = []
	snake.forEach(index => {
		squares[index].classList.add('snake')
	})

	let direction = 1

	function control(e) {
		if (changeDirection) {
			changeDirection = false
			if (e.keyCode === 39 && direction != -1) {
				direction = 1
			}
			else if (e.keyCode === 38 && direction != width) {
				direction = -width
			}
			else if (e.keyCode === 37 && direction != 1) {
				direction = -1
			}
			else if (e.keyCode === 40 && direction != -width) {
				direction = width
			}
			else {
				changeDirection = true
			}
		}
	}

	function newSnacc() {
		squares.forEach(element => element.classList.remove('snacc'))
		let random = Math.floor(Math.random()*squares.length)
		while(squares[random].classList.contains('snake')) {
			random = Math.floor(Math.random()*squares.length)
		}
		squares[random].classList.add('snacc')
	}


	function moveForward() {
		if (
			snake[0] + width >= (width*width) && direction === width ||
			snake[0] % width === width-1 && direction === 1 ||
			snake[0] % width === 0 && direction === -1 ||
			snake[0] - width < 0 && direction === -width ||
			squares[snake[0] + direction].classList.contains('snake')
		) {
			gameOver()
		}
		else if (squares[snake[0]+direction].classList.contains('snacc')) {
			squares[snake[0]+direction].classList.remove('snacc')
			snake.unshift(snake[0]+direction)
			squares[snake[0]].classList.add('snake')
			length++
			lengthDisplay.innerHTML = length
			//the entire screen is snake, then win
			if (!squares.some(element => !element.classList.contains('snake'))) {
				winCard.forEach(element => squares[element].classList.add('text'))
				clearInterval(timerId)
				timerId = null
				document.removeEventListener('keydown', control)
				startBtn.textContent = 'Play Again?'
				startNewGame = true
			}
			else {
				newSnacc()
			}
		}
		else {
			const tail = snake.pop()
			squares[tail].classList.remove('snake')
			snake.unshift(snake[0]+direction)
			squares[snake[0]].classList.add('snake')
		}
		changeDirection = true



	}

	function startGame() {
		squares.forEach(element => element.className = '')
		snake = [185,184,183]
		snake.forEach(index => {
			squares[index].classList.add('snake')
		})
		direction = 1
		length = 3
		lengthDisplay.innerHTML = 3
		timerId = setInterval(moveForward, timeInterval)
		newSnacc()


	}

	function endCardAnimation() {
		let tempTimerId = setTimeout(function(){
			endCard.forEach(element => squares[element].classList.add('text'))
		}, 200)
		timers.push(tempTimerId)
	}

	function endAnimation() {
		if (snake.length == 0) {
			let tempTimerId = setTimeout(function(){
				squares.forEach(element => element.classList.remove('snacc'))
				endCardAnimation()
			}, 150)
			timers.push(tempTimerId)
		}
		else if (snake.length > 0) {
			let tempTimerId = setTimeout(function(){
				const tail = snake.pop()
				squares[tail].classList.remove('snake')
				endAnimation()
			}, 150)
			timers.push(tempTimerId)
		}
	}

	function gameOver() {
		clearInterval(timerId)
		timerId = null
		document.removeEventListener('keydown', control)
		//End game animation
		endAnimation()
		startBtn.textContent = 'Reset?'
		startNewGame = true
	}

	startBtn.addEventListener('click', () => {
		for (var i=0; i<timers.length; i++) {
			clearTimeout(timers[i]);
		}
		if (timerId) {
			document.removeEventListener('keydown', control)
			clearInterval(timerId)
			timerId = null
		}
		else if (startNewGame) {
			document.addEventListener('keydown', control)
			startGame()
			startNewGame = false
			startBtn.textContent = 'Start/Pause'
		}
		else {
			document.addEventListener('keydown', control)
			timerId = setInterval(moveForward, timeInterval)

		}
		startBtn.blur()
	})



})