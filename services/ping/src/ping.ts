import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (_event) => {
  console.info('ping ping');
  return {
    statusCode: 204,
    body: '',
  };
};
