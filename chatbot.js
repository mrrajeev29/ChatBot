
const API_KEY='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';

// main.js
//console.log('main.js loaded');
//const apiKey = window.config.apiKey;
//console.log('API Key:', apiKey);


const chatInput=document.querySelector(".chat-input textarea");

const sendChatBtn=document.querySelector(".chat-input span");

const chatbox=document.querySelector(".chatbox")

//console.log(API_KEY);

let umsg;
//const API_KEY=apiKey;

const inputheight=chatInput.scrollHeight;

const createChatLi=(message,className)=>{
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent= className === "outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const generateResponse=(incomingChatLi)=>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const msgElm=incomingChatLi.querySelector("p");

    const requestOptions={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages:[{role:"user",content:umsg}]
        })
    }

    fetch(API_URL,requestOptions).then(res=> res.json()).then(data=>{
        msgElm.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        msgElm.textContent="Oops! Something wet wrong. Please try again.";
    }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));

}

const handleChat=()=>{
    umsg=chatInput.value.trim();
    //console.log(umsg);
    if(!umsg) return;
    chatInput.value="";

    chatInput.style.height=`${inputheight}px`;


    chatbox.appendChild(createChatLi(umsg,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputheight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;

});

chatInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"  && !e.shiftKey && window.innerWidth>800)
    {
        e.preventDefault();
        handleChat();
    }
});


sendChatBtn.addEventListener("click",handleChat);