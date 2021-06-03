import jwt_decode from "jwt-decode";
import * as globalPage from './globalPage.js';
import axios from 'axios';
import * as config from './config.js';
import {alertMsg} from './alert.js';


const leftHeader=document.querySelector('.headerLeft').querySelector('span');
const rightHeader=document.querySelector('.headerRight').querySelector('span');
const allPostsContainer=document.querySelector('.allPosts');
const userInfo=document.querySelector('.userInfo');

function formattedDate(d)
{
    const date=new Date(d);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}

function renderUserInfo(user,noOfPosts)
{
    userInfo.innerHTML=
    `
    <div class="info"><span class="type">Name : </span><span class="infoname">${user.name}</div></div>
    <div class="info"><span class="type">Description : </span><span class="infodescription">${user.description||''}</span></div>
    <div class="info"><span class="type">Email : </span><span class="infoemail">${user.email}</span></div>
    <div class="info"><span class="type">No of Posts : </span>${noOfPosts}</div>
    <div class="info"><span class="type">Joined : </span>${formattedDate(user.joined)}</div>
    `;
}

function renderUserProfile(data,isPostsDeletable)
{
    globalPage.renderPosts(data.posts,allPostsContainer,isPostsDeletable);
    renderUserInfo(data.user,data.posts.length)
}

function getAccountIdFromUrl()
{
    const arr=window.location.href.split('/');
    return arr[arr.length-1];
}

async function getUserInfo(isPostsDeletable=false)
{
    try
    {
        const id=getAccountIdFromUrl();
        const result=await axios({
            method:'GET',
            url:`${config.URL}/api/users/viewAccount/${id}`
        });
        if (result.data.status==='success')
            renderUserProfile(result.data,isPostsDeletable);
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}



async function init()
{
    rightHeader.dataset.userid=jwt_decode(globalPage.getCookieValue('jwt')).id;
    leftHeader.classList.add('pageLink');
    rightHeader.classList.add('pageLink');
    leftHeader.addEventListener('click',()=>location.replace('/global'));
    rightHeader.addEventListener('click',(e)=>location.replace(`/account/${e.target.dataset.userid}`));
    await getUserInfo();
}


export {init,getUserInfo};
