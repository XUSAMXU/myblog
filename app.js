const http = require('http');
const superagent = require('superagent')
const cheerio = require('cheerio')

const url = 'http://jianshu.com'
const homePage = 
 superagent.get( url ).end( err,res => {
	 if(err) return new Error(err)
	 return res.text
 })
http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end(homePage);
}).listen(3000, () => {
	console.log('Sever Running On 3000:');
})
