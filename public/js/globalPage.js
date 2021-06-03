import axios from 'axios';
import * as config from './config.js';
import {alertMsg} from './alert.js';
import jwt_decode from "jwt-decode";


const postsContainer=document.querySelector('.allPosts');
const postBtn=document.querySelector('.postBtn');
const postContent=document.querySelector('.postContent'); 

const rightHeader=document.querySelector('.headerRight').querySelector('span');


function getFormattedDate(d)
{
    const date=new Date(d);
    return `${date.toDateString()} at ${date.getHours()}:${date.getMinutes()}`;
}

function renderPosts(posts,container,isPostsDeletable=false)
{
    postsContainer.innerHTML='';
    posts.forEach(p=>
    {
        container.insertAdjacentHTML('afterbegin',
        `<div class="post" data-postid=${p._id}> 
            <div class="postUserName"  data-userid=${p.postedBy._id} >${p.postedBy.name||'Deleted User'}</div>
            <div class="postUserDescription">${isPostsDeletable?'<div class="deletePostBtn">DELETE</div>':(p.postedBy.description||'')}</div>
            <div class="postDate">${getFormattedDate(p.createdAt)}</div>
            <div class="postContent">${p.content}</div>
        </div>`);
    });
}

function getCookieValue(name)
{
    return document.cookie.split('; ').find(e=>e.startsWith(`${name}=`)).split('=')[1];
}

async function fetchAllPosts()
{
    try
    {
        const result=await axios(
        {
            method:'GET',
            url:`${config.URL}/api/posts/getAllPosts`
        });
        if (result.data.status==='success')
            renderPosts(result.data.posts,postsContainer);
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function createPost()
{
    try
    {
        const content=postContent.value;
        if (content.length>139)
        {
            alertMsg('Post must be within 140 characters');
            return Promise.resolve();
        }
        const result=await axios(
        {
            method:'POST',
            data:{content},
            url:`${config.URL}/api/posts/createPost`
        });
        if (result.data.status==='success')
        {
            await fetchAllPosts();
            alertMsg('Posted in global feed',3000);
            postContent.value='';
        }
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function init()
{
    await fetchAllPosts();
    postBtn.addEventListener('click',createPost);
    rightHeader.classList.add('pageLink');
    rightHeader.dataset.userid=jwt_decode(getCookieValue('jwt')).id;
    rightHeader.addEventListener('click',(e)=>location.replace(`/account/${e.target.dataset.userid}`));
    postsContainer.addEventListener('click',(e)=>
    {
        if (!e.target.closest('.postUserName')) return;
        location.replace(`/account/${e.target.dataset.userid}`);
    });
}

export {init,getCookieValue,renderPosts};
