import jwt_decode from "jwt-decode";
import * as globalPage from './globalPage.js';
import * as userProfilePage from './userProfilePage.js';
import axios from 'axios';
import * as config from './config.js';
import {alertMsg} from './alert.js';


const leftHeader=document.querySelector('.headerLeft').querySelector('span');
const rightHeader=document.querySelector('.headerRight').querySelector('span');

const allPostsContainer=document.querySelector('.allPosts');

const deleteAccountBtn=document.querySelector('.deleteAccountBtn');
const editAccountBtn=document.querySelector('.editAccountBtn');

const overlay=document.querySelector('.overlay');
const deleteAccountForm=document.querySelector('.deleteAccountForm');
const closeDeleteAccountFormBtn=document.querySelector('.closeDeleteAccountForm');
const cancelDeleteAccountBtn=document.querySelector('.cancelDeleteAccount');
const confirmDeleteAccountBtn=document.querySelector('.confirmDeleteAccount');

const editAccountForm=document.querySelector('.editAccountForm');
const closeEditAccountFormBtn=document.querySelector('.closeEditAccountForm');
const cancelEditAccountBtn=document.querySelector('.cancelEditAccount');
const confirmEditAccountBtn=document.querySelector('.confirmEditAccount');




async function logout()
{
    try
    {
        const result=await axios({
            method:'GET',
            url:`${config.URL}/api/users/logout`
        });
        if (result.data.status==='success') location.replace('/'); 
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function deletePost(e)
{
    if (!e.target.closest('.deletePostBtn')) return;
    try
    {
        const result=await axios({
            url:`${config.URL}/api/posts/deletePost/${e.target.closest('.post').dataset.postid}`,
            method:'DELETE'
        });
        userProfilePage.getUserInfo(true);
        alertMsg('Post Deleted',3000);
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function deleteAccount()
{
    try
    {
        const password=deleteAccountForm.querySelector('.password').value;
        const result=await axios({
            url:`${config.URL}/api/users/deleteAccount`,
            method:'DELETE',
            data:{password}
        });
        location.replace('/');
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function editAccount()
{
    try
    {
        const data={};
        ['name','email','description','newPassword','newPasswordConfirm','currentPassword'].forEach(e=>data[e]=editAccountForm.querySelector(`.${e}`).value);
        const result=await axios({
            url:`${config.URL}/api/users/editAccount`,
            method:'PATCH',
            data
        });
        if (result.data.status==='success')
        {
            closeEditForm();
            userProfilePage.getUserInfo(true);
            alertMsg('All edits saved',3000);
            editAccountForm.querySelectorAll('input').forEach(e=>e.value='');
        }
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

function openDeleteForm()
{
    overlay.style.display='block';
    deleteAccountForm.style.display='block';
}

function closeDeleteForm()
{
    overlay.style.display='none';
    deleteAccountForm.style.display='none';
}

function openEditForm()
{
    ['name','email','description'].forEach(e=>editAccountForm.querySelector(`.${e}`).value=document.querySelector(`.info${e}`).textContent);
    overlay.style.display='block';
    editAccountForm.style.display='block';
}

function closeEditForm()
{
    overlay.style.display='none';
    editAccountForm.style.display='none';
}


function init()
{
    rightHeader.dataset.userid=jwt_decode(globalPage.getCookieValue('jwt')).id;
    leftHeader.classList.add('pageLink');
    rightHeader.classList.add('pageLink');
    leftHeader.addEventListener('click',()=>location.replace('/global'));
    rightHeader.addEventListener('click',logout);
    userProfilePage.getUserInfo(true);
    allPostsContainer.addEventListener('click',deletePost);
    deleteAccountBtn.addEventListener('click',openDeleteForm);
    confirmDeleteAccountBtn.addEventListener('click',deleteAccount);
    [overlay,closeDeleteAccountFormBtn,cancelDeleteAccountBtn].forEach(e=>e.addEventListener('click',closeDeleteForm));

    editAccountBtn.addEventListener('click',openEditForm);
    [overlay,closeEditAccountFormBtn,cancelEditAccountBtn].forEach(e=>e.addEventListener('click',closeEditForm));
    confirmEditAccountBtn.addEventListener('click',editAccount);
};

export {init};