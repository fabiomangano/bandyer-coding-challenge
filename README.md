# Backend for Instants App 

A small backend for a mobile app allows users to create instants uploading their photos.  
The app exposes three endpoints, respectively to create a new instant, get a specific one or all.  
For full description, take a look at bandyer-assignment.pdf contained within the project folder.

## Getting Started

Clone repository:

```
git clone git@github.com:fabiomangano/bandyer-project.git
```

### Prerequisites

To run the project you need to have [node](https://nodejs.org/it/) and [docker](https://www.docker.com/products/docker-desktop) installed.

### Installing and running on local environment:

Install dependencies:

```
npm install
```
Run:
```
npm run start-dev
```
To test that the APIs are working as expected, I suggest use [postman](https://www.getpostman.com/downloads/).  
Inside project's folder, you will find a postman apis collection and a test image for this purpose.  
Making a post request to upload a photo, you should see appear it inside uploads folder, then inside instants folder.  
To inspect the db tables, you can instead use [robo 3T](https://robomongo.org/download).
## Running the tests

Run test:
```
npm run start-test
```
Code coverage:
```
npm run coverage
```

## Deployment

How app should look in production environment:

```
npm start
```

## Notes

This project was developed with the intent of reproduce, in a simplest way, a backend for a real mobile application.  
For this reason:

- The uploaded photos, and then the created Instants, are stored on the APIs server, instead of a storage service like AWS S3.  

- The message consumer of RabbitMQ runs on the APIs server, when it would be better to have a dedicated server for processing task.

- Config files were uploaded to the same project repository, when they are always shared using service like Keybase.

## Built With

* [Node.js](https://nodejs.org/it/) - Open-source, cross-platform, JavaScript runtime environment.
* [Express.js](https://expressjs.com/it/) -  Web application framework for Node.js.
* [Mongoose](https://mongoosejs.com/) -  Elegant mongodb object modeling for Node.js
* [MongoDB](https://www.mongodb.com/) -  Document-based, distributed database built for modern application.
* [RabbitMQ](https://www.rabbitmq.com/) - Open source message broker.

## Author

* **Fabio Mangano** 






