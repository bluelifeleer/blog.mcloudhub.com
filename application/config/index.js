const config = {
    mongodb: {
        url: 'mongodb://localhost:27017',
        user: 'root',
        password: 'xx19890907',
        database: 'blog',
        opations: {
            useNewUrlParser: true
        }
    },
    github: {
        client_id: '5fe59ee126edbea8f3df',
        client_secret: 'eaf2f8a2d1b0e21ebdf4ca75628a1dd6c9fdbeff',
        redirect_uri: 'https://blog.mcloudhub.com/other/github'
    }
}
module.exports = config;