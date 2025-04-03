import View from "./View.js";
import { loadCSS } from "../util.js";

loadCSS("../../static/css/screen.css");

export default class extends View {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("부천환경교육센터");
        this.pageData = null;
    }

    async render() {
        this.data = await api(`/pages/${this.postId}?formats=html`);
        this.pageData = this.data.pages[0];

        return `
            <div class="p-4">
                <h1 class="text-4xl my-2">${this.pageData.title}</h1>
                <div class="gb-content">
                    ${this.pageData.html}
                </div>
            </div>
        `;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ko-KR', { 
            year: 'numeric', month: 'numeric', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            hour12: false 
        }).format(date).replace(/\. /g, '. ');
    }
}
