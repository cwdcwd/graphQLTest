const graphqlHTTP = require('express-graphql');

const graphql = require('graphql');
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;

var requestPromise = require('request-promise');
var ENDPOINT = 'http://services.faa.gov/airport/status/';

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            hello: {
                type: GraphQLString,
                resolve() {
                    return 'world';
                }
            },
            time: {
                type: GraphQLString,
                resolve: () => {
                    return new Date();
                }
            },
            myName: {
                type: GraphQLString,
                args: {
                    firstName: {
                        description: 'your first name',
                        type: GraphQLString
                    },
                    lastName: {
                        description: 'your last name',
                        type: GraphQLString
                    }
                },
                resolve: (parentValue, args, request) => {
                    var strName = null;

                    if (args.firstName) {
                        strName = 'your name is ' + args.firstName;
                    }

                    if (args.lastName) {
                        strName += ' ' + args.lastName;
                    }

                    return (strName ? strName :
                        'well this is embarrassing. I really do not recall your name.');
                }
            },
            airportStatus: {
                type: GraphQLString,
                args: {
                    airportCode: {
                        description: '3 letter airport code',
                        type: GraphQLString
                    }
                },
                resolve: (parentValue, args, request) => {
                    var options = {
                        method: 'GET',
                        uri: ENDPOINT + args.airportCode,
                        json: true
                    };

                    return new Promise((airportResolve, airportReject) => {
                        requestPromise(options).then((data) => {
                            console.log(data);
                            airportResolve(data.name + ': ' +
                                data.status.avgDelay + ' ' + data.status.reason
                            );
                        }).catch((err) => {
                            console.log(err);
                            airportReject(
                                'an error occured while trying to fetch data for ' +
                                args.airportCode);
                        });
                    });
                }
            }
        }
    })
});



module.exports = graphqlHTTP({
    schema: schema,
    graphiql: true
});
