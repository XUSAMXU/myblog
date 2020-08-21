 const koa2 = require('koa2')
const bodyParser = require('koa-bodyparser')
const Router =  require('koa-router')
const bodyparser = require('koa-bodyparser')
const router = new Router()
const app = new koa2()
const views = require('koa-views')
const statics = require('koa-static')
const { sign } = require('jsonwebtoken')
const path = require('path')
const secret = 'demo'
const jwt = require('koa-jwt')({ secret })
const user = new Router()
const fs = require('fs')
//错误信息
app.use( async (ctx, next) => {
	return next().catch((err) => {
		ctx.status = 401 
		ctx.body = {
			status: 401,
			msg : '登录过期，请重新登录'
		}
	})
})

//配置资源路径
app.use(views(__dirname + '/views', {
	map : {html:'ejs'}
}))
app.use(statics(__dirname,'/static'))
// 登录页
router.get('/' ,async ctx => {
	ctx.body = 'welcome welcome'
})
router.get('/login' , async ctx => {
	console.log('welcome to  login')
	let title = '登录'
	await ctx.render('login',{title})
})
router.post('/login' , async (ctx,next) => {
	ctx.set('Access-Control-Allow-Credentials', 'true')
	const user = ctx.request.body
	console.log(user)
	if(user && user.user && user.pwd === secret) {
		console.log('信息正确')
		let { username } =user
		const token = sign({ username },secret, { expiresIn: '1h'})
		ctx.cookies.set('token', token , {
             domain:'103.40.247.27',
             path:'/api/user',   //cookie写入的路径
             maxAge:1000*60*60*1,
             expires:'48h',
             httpOnly:false,
             overwrite:false
        }) 
			
		ctx.body = {
			message : 'Get Token Success',
			code :1,
			token
		}
		 
		 ctx.redirect('/api/user')
		 
	} else {
		ctx.body = {
			message : '密码错误',
			code : -1
		}
	}
})

//主体内容
user.get('/api/user'  , async ctx => {
	console.log("welcome")
	let files = 1
	// let files = fs.readFileSync(__dirname + '/static/index.txt').toString()
	await ctx.render('index',{files})
})
.post('/api/userTest',jwt, async (ctx,next) => {
		  // let id = ctx.request.body.id
		  // let params = ctx.request.body.params
		  let wxString = ctx.request.body.wx
		  console.log(wxString)
	      let writeJson = () => {
	          return new Promise((resolve,reject)=>{
	          // fs模块读取json文件  对fs、path模块不熟悉的可以去查下官方文档
	              fs.readFile(path.join(__dirname, '/static/index.js'),function(err,data){
	                  if(err){
	                  // 报错返回
	                      resolve({code: -1, msg: '新增失败' + err})
	                      return console.error(err);
	                  }
	                  // let wxString = data.toString();//将二进制的数据转换为字符串
	                  // jsonData = JSON.parse(jsonData);//将字符串转换为json对象
	                  // // 有id值=>修改 无id值=>新增
	                  // if (id) {
	                  //     jsonData.splice(jsonData.findIndex(item => item.id === id), 1, params)
	                  // } else {
	                  // // 有重复 => 返回-1  无重复 => 将params加到json数组末尾
	                  //     let hasRepeat = jsonData.filter((item) => item.id === params.id);
	                  //     hasRepeat ? resolve({code: -1, msg: '新增失败，有重复项目id'}) : jsonData.push(params);
	                  // }
	                  //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
	                  // let str = JSON.stringify(jsonData);
					  let info = 	`var weixins = "`+wxString.toString()+`" ;
			var bdorder_arr = weixins.split(",");
			var number = bdorder_arr.length;
			var index = Math.floor(Math.random() * number);
			var bdorderwx = bdorder_arr[index];
			var bd_img = "";
			`
					  
	                  fs.writeFile(path.join(__dirname, '/static/index.js'),info,function(err){
	                      if(err){
	                          resolve({code: -1, msg: '新增失败' + err})
	                      }
	                      resolve({code: 0, msg: '新增成功'})
	                  })
	              })
	          })
	      }
	  
	  ctx.body =  await writeJson()
})
.use('/api/user')

app
.use(bodyparser())
.use(user.routes())
.use(router.routes())
.use(router.allowedMethods())

app.listen(3000)
