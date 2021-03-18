import MiniRouter from './MiniRouter';

const app = document.querySelector('#app');
const router = new MiniRouter({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: /about/,
            cb() {
                app.innerHTML = `<h1>这里是关于页面</h1>`;
            }
        },
        {
            path: /news\/(.*)\/detail\/(.*)/,
            cb(id, specification) {
                app.innerHTML = `<h1>这里是新闻页</h1><h2>您正在浏览id为${id}<br>渠道为${specification}的新闻</h2>`;
            }
        },
        {
            path: '',
            cb() {
                app.innerHTML = `<h1>欢迎来到首页！</h1>`;
            }
        }
    ]
});

document.querySelector('#home').addEventListener('click', () => {
    router.replace('/');
})

document.querySelector('#about').addEventListener('click', () => {
    router.replace('/about');
})

document.querySelector('#detail12').addEventListener('click', () => {
    router.push('/news/12/detail/baidu');
})

document.querySelector('#detail20').addEventListener('click', () => {
    router.replace('/news/20/detail/toutiao');
})


