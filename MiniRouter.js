export default class MiniRouter {
    constructor(options) {
        const {mode, routes, base} = options;
        this.mode = mode || (window.history.pushState ? 'history' : 'hash');
        this.routes = routes || [];
        this.base = base || '/';

        this.setupListener();
    }

    addRoute(routeConfig) {
        this.routes.push(routeConfig);
    }

    go(n) {
        window.history.go(n);
    }

    back() {
        window.location.back();
    }

    forward() {
        window.location.forward();
    }

    push(url) {
        if (this.mode === 'hash') {
            this.pushHash(url);
        } else {
            this.pushState(url);
        }
    }

    replace(path) {
        if (this.mode === 'hash') {
            this.replaceHash(path);
        } else {
            this.replaceState(path);
        }
    }

    pushState(url, replace) {
        const history = window.history;

        try {
            if (replace) {
                history.replaceState(null, null, url);
            } else {
                history.pushState(null, null, url);
            }

            this.handleRoutingEvent();
        } catch (e) {
            window.location[replace ? 'replace' : 'assign'](url);
        }
    }

    replaceState(url) {
        this.pushState(url, true);
    }

    pushHash(path) {
        window.location.hash = path;
    }

    replaceHash(path) {
        window.location.replace(`${window.location.href.replace(/#(.*)$/, '')}#${path}`);
    }

    getPath() {
        let path = '';
        if (this.mode === 'history') {
            path = this.clearSlashes(decodeURI(window.location.pathname));
            path = this.base !== '/' ? path.replace(this.base, '') : path;
        } else {
            const match = window.location.href.match(/#(.*)$/);

            path = match ? match[1] : '';
        }

        // 可能还有多余斜杠，因此需要再清除一遍
        return this.clearSlashes(path);
    }

    clearSlashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    setupListener() {
        this.handleRoutingEvent();

        if (this.mode === 'hash') {
            window.addEventListener('hashchange', this.handleRoutingEvent.bind(this));
        } else {
            window.addEventListener('popstate', this.handleRoutingEvent.bind(this));
        }
    }

    handleRoutingEvent() {
        if (this.current === this.getPath()) return;
        this.current = this.getPath();

        for (let i = 0; i < this.routes.length; i++) {
            const match = this.current.match(this.routes[i].path);
            if (match) {
                match.shift();
                this.routes[i].cb.apply({}, match);

                return;
            }
        }
    }
}
