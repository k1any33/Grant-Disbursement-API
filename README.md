# Grant Disbursement API with Nest Js and Typescript

## Description
A RESTful API that would decide on groups of people who are eligible for various upcoming government grants. These grants are disbursed based on certain criteria - like total household income, age, occupation, etc. 

## Accessing the app
The app is deployed on Heroku. Click the link [here](https://ky-grant-disbursement-api.herokuapp.com/api-docs/static/index.html#/) to access the swagger docs. 

## Running the app locally (Docker)

Spin up a nest js and mongo container with docker
```bash
docker-compose up
```

Access the swagger docs [http:localhost:8080/api-docs](http:localhost:8080/api-docs)

## Two ways to interact with mongo
1. Open a new terminal (only through docker)
```bash
# List all the docker containers that are running locally on your machine
docker ps 

# Copy the container ID for mongo container and exec this command to access mongo shell
docker exec -it <containerid> mongo
```  
Press "control c" to exit mongo shell

2. Download mongo compass [here](https://www.mongodb.com/products/compass)

Connect to mongodb using this connection string "mongodb://localhost:27017"

## Running the app without docker

```bash
# install node_modules
npm i

# Create a .env file in root folder
touch .env

# Give a connection string for mongo, if it's not provided, make sure that mongo is installed locally on your operating system
MONGO_URI:<mongoConnectionUri>

# Run the app
$ npm run dev
```
## Deployment Steps

1. Create a main.yml file in .github/workflows
2. Add these secret keys in github repository

```bash
heroku_api_key: ${{secrets.HEROKU_API_KEY}}
heroku_app_name: ${{secrets.APP_NAME}}
heroku_email: ${{secrets.EMAIL_ADDRESS}}
```
3. The application will be deployed to heroku when a pull request is approved to merge to main branch

## Integration Test

Uses [Jest](https://jestjs.io/) for integration testing
```bash
# unit tests
$ npm run test
```

## Assumptions and Notes

Total Annual Income is added to household entity for easier computation of grants

Updating Household Members Endpoint
- Assume that only one household member can be added at one time
- Assume that the annual income is in SGD

Student Encouragement Bonus 
- Assume that occupation must be student if not grant won’t be given
- No restrictions on type of marital status

Multigeneration Scheme
- Assume that the occupation type doesn't have to be of type 'Student' for household members below the age of 18