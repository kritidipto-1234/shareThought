import axios from 'axios';
import * as config from './config.js';
import {alertMsg} from './alert.js';


const resetPasswordBtn=document.querySelector('.resetPasswordBtn');
const resetPasswordForm=document.querySelector('.resetPasswordForm');

const leftHeader=document.querySelector('.headerLeft').querySelector('span');

async function resetPassword()
{
    try
    {
        const password=resetPasswordForm.querySelector('.password').value;
        const passwordConfirm=resetPasswordForm.querySelector('.passwordConfirm').value;
        const result=await axios(
        {
            method:'PATCH',
            url:window.location.href.replace('change','reset'),
            data:{passwordConfirm,password}
        });    
        if (result.data.status==='success') resetPasswordForm.innerHTML=`Congratulations!Your password has been successfully changed.Now u can go to HomePage and login with your new password`;
    }
    catch(e)
    {
        alertMsg(JSON.stringify(e.response.data.error.message),3000);
    }
}


function init()
{
    resetPasswordBtn.addEventListener('click',resetPassword);
    leftHeader.classList.add('pageLink');
    leftHeader.addEventListener('click',()=>location.replace('/'));
}


export {init};