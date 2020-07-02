const http = require('http');

const homePage = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        * {
            padding: 0;
            margin: 0;
        }
        body {
            padding: 30px 0;
            text-align: center;
            font-size: 16px;
            background-color: #333;
        }
        h1,h2 {
            color: #fff;
        }
        nav {
            margin-top: 20px;
        }
        a {
            color: #ccc;
            cursor: pointer;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <h1>Nodejs部署示例项目</h1>
    <h2>项目部署上线示例</h2>
    <nav>
        <ul>
            <li><a>列表</a></li>
        </ul>
    </nav>
</body>

</html>
`

http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end(homePage);
}).listen(3000, () => {
    console.log('Sever Running On 3000:');
})