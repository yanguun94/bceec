import View from "./View.js";
import { loadCSS } from "../util.js";

loadCSS("../../static/css/screen.css");

export default class extends View {
    constructor(params) {
        super(params);
        this.id = params.id;
        this.type = params.type;
        this.setTitle("포스트");
        this.postData = null;
    }

    async render() {
        this.data = await api(`/${this.type}/${this.id}?include=authors,tags&formats=html`);
        this.postData = this.data[this.type][0];
        this.setTitle(this.postData.title);
        this.otherPosts = await api('/posts/?limit=3');

        return `
            <div class="p-4 mb-4">
                <div class="text-gray-800">${this.postData.primary_tag ? this.postData.primary_tag.name : ''}</div>
                <h1 class="text-4xl my-2">${this.postData.title}</h1>
                <div class="text-sm text-gray-500 my-4">
                    <span>${this.postData.primary_author.name}</span>
                    <span class="mx-2">${this.formatDate(this.postData.published_at)}</span>
                </div>
                <div class="gb-content">
                    ${this.postData.html}
                </div>
            </div>
            <h1 class="text-lg font-bold pt-4 px-4 border-t-1 border-gray-300">
                <span class="text-lime-300">다른</span> 소식
            </h1>
            <div class="p-4">
                <ul class="h-full">
                    ${this.otherPosts.posts.map(post => `
                        <li>
                            <a href="/posts/${post.id}" class="flex flex-row py-4" data-link>
                                <img class="aspect-square object-cover rounded-lg w-1/5" src="${post.feature_image}" alt="${post.feature_image_alt}">
                                <div class="flex flex-col w-4/5 p-2 ml-2">
                                    <h3 class="font-bold truncate">${post.title}</h3>
                                    <p class="text-sm text-gray-500 truncate">${post.excerpt}</p>
                                </div>
                            </a>
                        </li>
                        ${post !== this.otherPosts.posts[this.otherPosts.posts.length - 1] ? '<hr class="text-gray-200">' : ''}
                    `).join('')}
                </ul>
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
