export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    async beforeRender() {}

    async render() { return ''; }

    async rendered() {}
}