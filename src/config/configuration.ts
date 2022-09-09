export default () => ({
  port: process.env.PORT || 8080,
  mongouri: process.env.MONGO_URI || 'mongodb://mongo:27017',
})
