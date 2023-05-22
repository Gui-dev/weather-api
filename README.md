# Finding waves

## 💻 Project

<p>
Finding waves é uma API para calcular a melhor condição de surf entre varias praias, essa API tem como objetivo servir a aplicação web
</p>

## ✨ Technologies used

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)
- [MongoDB](https://www.mongodb.com/)
- [Github Actions](https://github.com/features/actions)
- [Stormglass API](https://stormglass.io)


### Request

<p>User</p>
<span>Log in</span>

```bash
POST /users/authenticate
```

```bash
{
	"email": "bruce@email.com",
	"password": "123456"
}
```

<span>Return</span>

```bash
{
	"name": "Bruce Wayne",
	"email": "bruce@email.com",
	"password": "$2b$10$P209KN8pguizvOuDLwpv7eDkyLDwhlzdh6V1PTAWhZMmXEwgNlnEK",
	"id": "64671821d60be0800462dc93",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDY3MTgyMWQ2MGJlMDgwMDQ2MmRjOTMiLCJpYXQiOjE2ODQ1NjQzNzYsImV4cCI6MTY4NTE2OTE3Nn0.8zGIEGcXgdN4Rj2KrE9OwDJeG81NsRcFqMmJgnBCRig"
}
```

<p>Forecast</p>
<span>List beachs</span>

```bash
GET /forecat
```

<span>Return example</span>

```bash
[
  {
		"time": "2023-04-26T00:00:00+00:00",
		"forecast": [
			{
				"name": "Manly",
				"position": "E",
				"latitude": -33.792726,
				"longitude": 151.289824,
				"rating": 1,
				"time": "2023-04-26T00:00:00+00:00",
				"swellDirection": 158.66,
				"swellHeight": 0.09,
				"swellPeriod": 16.8,
				"waveDirection": 99.71,
				"waveHeight": 0.96,
				"windDirection": 28.73,
				"windSpeed": 2.67
			},
			{
				"name": "Manly",
				"position": "E",
				"latitude": -33.792726,
				"longitude": 151.289824,
				"rating": 1,
				"time": "2023-04-26T00:00:00+00:00",
				"swellDirection": 158.66,
				"swellHeight": 0.09,
				"swellPeriod": 16.8,
				"waveDirection": 99.71,
				"waveHeight": 0.96,
				"windDirection": 28.73,
				"windSpeed": 2.67
			}
		]
	}
]
```

<p>Beach</p>
<span>Create beach</span>

```bash
POST /beaches
```

```bash
{
	"name": "Manly",
	"position": "E",
	"latitude": -33.792726,
	"longitude": 151.289824
}
```

<span>Return example</span>

```bash
{
	"name": "Manly",
	"position": "E",
	"latitude": -33.792726,
	"longitude": 151.289824,
	"userId": "64671821d60be0800462dc93",
	"id": "646869d0e5a5646d600c2cab"
}
```

# 🚀 How to run

## clone repository

```bash
git clone https://github.com/Gui-dev/weather-api.git
```

## create a Stormglass account

```bash
https://stormglass.io
```

## create a MongoDb Atlas account or a MongoDB database of your choice

```bash
https://www.mongodb.com/
```

## Install dependencies

```bash
npm ci
```

## Run the app

npm run start:local
