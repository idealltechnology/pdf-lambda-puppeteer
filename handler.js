const chromium = require('chrome-aws-lambda');
const AWS =require('aws-sdk');
const s3Client = new AWS.S3();

module.exports.getPDF = async (event, _context) => {
  try {
    const { name, html } = JSON.parse(event.body);
    const pdf = await getPDFBuffer(html, {
      format: 'A4',
      printBackground: true,
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    });

    const savedS3 = await s3Client
      .upload({
        Key: name + '_' + Math.ceil(Math.random() * 10000000) + '.pdf',
        Body: pdf,
        Bucket:  process.env.BUCKET_NAME,
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
const getPDFBuffer = async (html, options) => {
  let browser = null;
  try {
    const executablePath = process.env.IS_OFFLINE ? null : await chromium.executablePath;
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath,
    });

    const page = await browser.newPage();
    const loaded = page.waitForNavigation({
      waitUntil: 'load',
    });

    await page.setContent(html);
    await loaded;

    return await page.pdf(options);
  } catch (error) {
    return error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};