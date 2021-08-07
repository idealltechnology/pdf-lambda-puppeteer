import * as handlebars from 'handlebars';

const html: string = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
    .page-break {
      page-break-before: always;
    }
    .custom-font {
      font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .hello{
      color:red;
    }
  </style>
  <body>
    <h1 class="hello">Hello World</h1>
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam consequatur
      voluptate, aut libero natus aliquid dignissimos! Voluptatem repellat
      quibusdam doloribus impedit quisquam labore molestias, saepe illum,
      assumenda eum voluptate praesentium.
    </div>
    <br /><br />
    <div>
      Hi, My Name is {{name}}, Welcome to PDF generation :)
    </div>
  </body>
</html>
`;

export const getTemplate: any = (context: any) => {
  return handlebars.compile(html)(context);
};
