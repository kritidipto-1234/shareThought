const message=document.querySelector('.message');
let timer;

function  alertMsg(content,time=2200)
{
    clearTimeout(timer);
    message.innerHTML=content;
    message.style.display='block';
    timer=setTimeout(()=>message.style.display='none',time);
}

export {alertMsg}