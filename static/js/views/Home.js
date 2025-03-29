import View from "./View.js";
import Glide from "https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/glide.esm.js";
import { loadCSS } from "../util.js";

loadCSS("https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.core.min.css");
loadCSS("https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.theme.min.css");

export default class extends View {
    constructor(params) {
        super(params);
        this.setTitle("부천환경교육센터 | 홈");
        this.featuredData = null;
        this.tagsData = null;
        this.resolvedTagsData = null;
        this.latestPostsData = null;
    }

    async beforeRender() {
        this.featuredData = await api('/posts/?filter=featured:true');
        this.tagsData = await api('/tags/');
        const tagsPromiseArray = this.tagsData.tags.map(async item => {
            const postsData = await api(`/posts/?filter=tag:${item.slug}&limit=3`);
            item.posts = postsData.posts;
            return item;
        });
        this.resolvedTagsData = await Promise.all(tagsPromiseArray);
        this.latestPostsData = await api('/posts/?page=1');
    }

    async render() {
        return `
            <div>
                <div class="glide slide1">
                    <div class="glide__track" data-glide-el="track">
                        <ul class="glide__slides">
                            ${this.featuredData.posts.map(item => `
                                <li class="glide__slide px-4">
                                    <a href="/posts/${item.id}" data-link>
                                        <img class="rounded-xl aspect-square" src="${item.feature_image}" alt="${item.feature_image_alt}">
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="glide__bullets" data-glide-el="controls[nav]">
                        ${this.featuredData.posts.map((_, index) => `<button class="glide__bullet" data-glide-dir="=${index}"></button>`).join('')}
                    </div>
                </div>
                <h1 class="text-lg font-bold p-4">
                    <span class="text-lime-300">사업</span> 소개
                </h1>
                <div class="glide slide2">
                    <div class="glide__track" data-glide-el="track">
                        <ul class="glide__slides">
                            ${this.resolvedTagsData.map(item => `
                                <li class="glide__slide px-4">
                                    <div class="rounded-xl border-1 border-gray-200 p-4">
                                        <div class="flex justify-between">
                                            <div class="flex flex-col">
                                                <h2 class="text-lg">${item.name}</h2>
                                            </div>
                                            <img class="aspect-square object-cover rounded-full w-1/5 border-1" src="${item.feature_image}" alt="${item.feature_image_alt}">
                                        </div>
                                        <p class="py-4">${item.description}</p>
                                        <ul class="h-full">
                                            ${item.posts.map(post => `
                                                <li class="flex flex-row py-4">
                                                    <img class="aspect-square object-cover rounded-lg w-1/5" src="${post.feature_image}" alt="${post.feature_image_alt}">
                                                    <div class="flex flex-col w-4/5 p-2">
                                                        <a href="/posts/${post.id}" data-link>
                                                            <h3 class="font-bold truncate">${post.title}</h3>
                                                            <p class="text-sm text-gray-500 truncate">${post.excerpt}</p>
                                                        </a>
                                                    </div>
                                                </li>
                                                ${post !== item.posts[item.posts.length - 1] ? '<hr class="text-gray-200">' : ''}
                                            `).join('')}
                                        </ul>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="glide__bullets" data-glide-el="controls[nav]">
                        ${this.tagsData.tags.map((_, index) => `<button class="glide__bullet" data-glide-dir="=${index}"></button>`).join('')}
                    </div>
                </div>
                <div>
                    <h1 class="text-lg font-bold p-4">
                        <span class="text-lime-300">최신</span> 소식
                    </h1>
                    <ul id="latest-posts">
                        ${this.latestPostsData.posts.map(post => `
                            <li class="flex flex-col py-4">
                                <a href="/posts/${post.id}" data-link>
                                    <img class="aspect-2/1 object-cover rounded-lg w-full p-4" src="${post.feature_image}" alt="${post.feature_image_alt}">
                                    <h3 class="font-bold px-6 mb-4">${post.title}</h3>
                                    <p class="text-sm px-8 text-gray-500">${post.excerpt}</p>
                                </a>
                            </li>
                            ${post !== this.latestPostsData.posts[this.latestPostsData.posts.length - 1] ? '<div class="px-4"><hr></div>' : ''}
                        `).join('')}
                    </ul>
                </div>
                <div class="flex justify-center p-4">
                    <button class="more p-2 w-full text-sm font-bold rounded-xl bg-lime-300" data-event="click:loadMorePosts">더보기</button>
                </div>
            </div>
        `;
    }

    async rendered() {
        new Glide('.slide1', {
            type: 'carousel',
            autoplay: 5000,
        }).mount();
        new Glide('.slide2', {
            type: 'carousel',
            autoplay: 5000,
        }).mount();
    }

    async loadMorePosts(button) {
        const currentPage = this.latestPostsData.meta.pagination.page;
        const totalPages = this.latestPostsData.meta.pagination.pages;
        if (currentPage < totalPages) {
            const morePostsData = await api(`/posts/?page=${currentPage + 1}`);
            const morePostsHtml = morePostsData.posts.map(post => `
                <li class="flex flex-col py-4">
                    <img class="aspect-2/1 object-cover rounded-lg w-full p-4" src="${post.feature_image}" alt="${post.feature_image_alt}">
                    <h3 class="font-bold px-6 mb-4">${post.title}</h3>
                    <p class="text-sm px-8 text-gray-500">${post.excerpt}</p>
                </li>
                ${post !== morePostsData.posts[morePostsData.posts.length - 1] ? '<div class="px-4"><hr></div>' : ''}
            `).join('');
            document.querySelector('#latest-posts').insertAdjacentHTML('beforeend', morePostsHtml);
            this.latestPostsData.posts.push(...morePostsData.posts);
            this.latestPostsData.meta.pagination.page = currentPage + 1;
        } else {
            button.disabled = true;
            button.textContent = "더 이상 게시물이 없습니다.";
        }
    }
}