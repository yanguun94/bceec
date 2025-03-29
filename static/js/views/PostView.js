import View from "./View.js";
import { loadCSS } from "../util.js";

loadCSS("../../static/css/posts.css");

export default class extends View {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Viewing Post");
    }

    async render() {
        this.data = await api(`/posts/${this.postId}?include=authors,tags&formats=html`);
        this.postData = this.data.posts[0];
        console.log(this.postData);

        return `
            <div class="p-4">
                <div class="text-gray-800">${this.postData.primary_tag.name}</div>
                <h1 class="text-4xl my-2">${this.postData.title}</h1>
                <div class="text-sm text-gray-500 my-4">
                    <span>${this.postData.primary_author.name}</span>
                    <span class="mx-2">${this.formatDate(this.postData.published_at)}</span>
                </div>
                <div class="gb-content">
                    ${this.postData.html}
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
