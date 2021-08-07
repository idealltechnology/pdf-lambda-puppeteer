import { Helper } from './Helper';
import { GeneratorFunction } from './types/GeneratorTypes';
import { getTemplate } from './templates/pdf-template';
import { S3 } from 'aws-sdk';
const s3Client = new S3();
const bucket = process.env.bucketName;

export class PDFGenerator {
  /**
   * This function returns the buffer for a generated PDF of manual
   * @param {any} event - The object that comes for lambda which includes the http's attributes
   * @returns {Array<any>} array of Structure Instructions
   */
  static getPDF: GeneratorFunction = async () => {
    try {
      const pdf = await Helper.getPDFBuffer(getTemplate({ name: 'Sezer' }), {
        format: 'A4',
        printBackground: true,
        margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
      });

      /*  fs.writeFileSync('test.pdf', pdf); */

      const params = {
        Key: Math.ceil(Math.random() * 10000000) + '.pdf',
        Body: pdf,
        Bucket: bucket,
        ContentType: 'application/pdf',
      };

      const newData = await s3Client.upload(params).promise();

      if (!newData) {
        throw Error('there was an error writing the file');
      }
      console.log(newData);

      return {
        statusCode: 200,
        body: newData.Location,
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
}
