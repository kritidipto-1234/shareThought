import axios from 'axios';
import * as config from './config.js';
import {alertMsg} from './alert.js';

const loginForm=document.querySelector('.loginForm');
const signUpForm=document.querySelector('.signUpForm');
const forgotPasswordForm=document.querySelector('.forgotPasswordForm');

const loginFormSelector=document.querySelector('.loginFormBtn');
const signUpFormSelector=document.querySelector('.signUpFormBtn');
const forgotPasswordFormSelector=document.querySelector('.forgotPasswordFormBtn');

const loginBtn=document.querySelector('.loginBtn');
const signUpBtn=document.querySelector('.signUpBtn');
const forgotPasswordBtn=document.querySelector('.forgotPasswordBtn');

function displayForm(form)
{
    loginForm.style.display="none";
    signUpForm.style.display="none";
    forgotPasswordForm.style.display="none";
    form.style.display="flex";
}

async function login(e)
{
    try
    {
        const email=loginForm.querySelector('.email').value;
        const password=loginForm.querySelector('.password').value;
        const result=await axios(
        {
            method:'POST',
            url:`${config.URL}/api/users/login`,
            data:{email,password}
        });
        if (result.data.status==='success') location.replace('/global');
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function signUp(e)
{
    try
    {
        const name=signUpForm.querySelector('.name').value;
        const email=signUpForm.querySelector('.email').value;
        const description=signUpForm.querySelector('.description').value;
        const password=signUpForm.querySelector('.password').value;
        const passwordConfirm=signUpForm.querySelector('.passwordConfirm').value;
        const result=await axios(
        {
            method:'POST',
            url:`${config.URL}/api/users/createUser`,
            data:{name,email,description,password,passwordConfirm}
        });
        if (result.data.status==='success') location.replace('/global');
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

async function requestPasswordChange(e)
{
    try
    {
        const email=forgotPasswordForm.querySelector('.email').value;
        alertMsg('Wait a few seconds',13000);
        const result=await axios(
        {
            method:'POST',
            url:`${config.URL}/api/users/forgotPassword`,
            data:{email}
        });
        if (result.data.status==='success') alertMsg('A link has been send to the entered email. Click on that to change password',5000);
    }
    catch(e)
    {
        alertMsg(e.response.data.error.message,3000);
    }
}

function init()
{
    loginFormSelector.addEventListener('click',displayForm.bind(null,loginForm));
    signUpFormSelector.addEventListener('click',displayForm.bind(null,signUpForm));
    forgotPasswordFormSelector.addEventListener('click',displayForm.bind(null,forgotPasswordForm));

    loginBtn.addEventListener('click',login);
    signUpBtn.addEventListener('click',signUp);
    forgotPasswordBtn.addEventListener('click',requestPasswordChange);
}

export {init};