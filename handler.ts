import { APIGatewayProxyHandler } from 'aws-lambda';
import { Helper } from './src/Helper';
import { S3 } from 'aws-sdk';
const s3Client = new S3();
const bucket = process.env.bucketName;
export const getPDF: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { name, html } = JSON.parse(event.body);
    const pdf = await Helper.getPDFBuffer(html, {
      format: 'A4',
      printBackground: true,
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    });

    const savedS3 = await s3Client
      .upload({
        Key: name + '_' + Math.ceil(Math.random() * 10000000) + '.pdf',
        Body: pdf,
        Bucket: bucket,
        ContentType: 'application/pdf',
      })
      .promise();

    if (!savedS3) {
      throw Error('there was an error writing the file');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(savedS3),
    };
  } catch (error) {
    console.error('Error : ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
        message: 'Something went wrong',
      }),
    };
  }
};
