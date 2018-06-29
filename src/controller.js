let data = {
  date: null,
  startDate: null,
  toDate: null
}

class Controller {
	setDate = (date) => {
		if (Date.parse(date)) {
				data.date = date
		} else {
				console.warn('-d: 請輸入正確的時間格式')
		}
	}
		
	setStart = (date) => {
		if (Date.parse(date)) {
				data.startDate = date
		} else {
				console.warn('-f: 請輸入正確的時間格式')
		}
	}
		
	setTo = (date) => {
		if (Date.parse(date)) {
			data.toDate = date
		} else {
			console.warn('-t: 請輸入正確的時間格式')
		}
	}
		
	setToDatabase = () => {
		data.toDatabase = true
	}

	data = () => {
		return data
	}
}

export default new Controller()
