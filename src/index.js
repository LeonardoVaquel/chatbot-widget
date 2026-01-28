class Chatbot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.sessionId = localStorage.getItem('m_id') || Math.random().toString(36).slice(2);
    localStorage.setItem('m_id', this.sessionId);
  }

  get styles() {
    return `
      :host { --p: ${this.getAttribute('color') || '#ff4400'}; font-family: system-ui; }
      /* ... aquí va el resto de tu CSS minificado manualmente o por Vite ... */
      .win { display: ${this.open ? 'flex' : 'none'}; position: fixed; bottom: 80px; right: 20px; width: 320px; height: 450px; background: #fff; box-shadow: 0 5px 20px #0003; border-radius: 12px; flex-direction: column; .btn { background-color: ${this.getAttribute('color')}; width: 60px; height: 36px; padding: 8px 12px 8px 12px; border-radius: 16px; border: none; justify-content: center; justify-items: center; }; .btn:hover {
      cursor: pointer; background-color:rgb(248, 214, 214); color: #333333; border: 1px solid; border-color: ${this.getAttribute('color')}; transition: all; transition-duration: 0.2s}; .divider { height: 1px; background-color:rgb(173, 173, 173) } input { background-color: transparent; padding: 0px 12px 0px 12px; border: 1px solid; border-color:rgb(173, 173, 173); border-radius: 20px; }; .chat_header { height: 40px; width: 100%; display: flex; justify-content: center; align-content: center; flex-wrap: wrap; font-weight: bold; background-color: ${this.getAttribute('color')}; border-top-left-radius: 12px; border-top-right-radius: 12px;}; .usermessage {height: fit-content; width: fit-content; max-width: 70%; border-radius: 18px; background-color: rgb(165, 165, 165); padding: 12px 14px 12px 14px; margin: 8px 0px 8px 0px; justify-self: end;}; .botmessage {height: fit-content; min-width: 50%; width: fit-content; max-width: 70%; padding: 16px 16px 16px 16px; margin: 8px 0px 8px 0px; border-radius: 18px; background-color: ${this.getAttribute('color')}; color: white; justify-self: start}; .writting { font-size: 12px; font-weight: 200; padding: 8px 12px 8px 12px;} }
    `;
  }

  connectedCallback() {
    this.render();
  }

  async send() {
    const userMsg = this.shadowRoot.querySelector('input');
    const userVal = userMsg.value.trim();
    const inputKey = this.getAttribute('input-key');
    const outputKey = this.getAttribute('output-key');
    const bodyObj = Object.assign({}, {sessionId: this.sessionId})
    
    if (!userVal) return;
    
    this.add(userVal, 'user');
    userMsg.value = '';
    bodyObj[inputKey] = userVal;
  
    const res = await fetch(this.getAttribute('url'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj)
    });
    
    if (res.satus === 500 || !res.ok) {
      this.add(this.getAttribute('service-off-msg', 'bot'))
    } else {
      const data = await res.json();
      console.log('res ', data)
      if (Array.isArray(data) && data.length === 1) {
        this.add(data[0][outputKey], 'bot')
      } else {
        this.add(data[outputKey], 'bot');
      }
    }
  }

  render() {
    this.open = true
    this.shadowRoot.innerHTML = `
      <style>${this.styles}</style>
      <div class="win" id="window">
      <div class="chat_header">${this.getAttribute('bot-name')}</div>
        <div class="response" id="message" style="flex:1;overflow:auto;padding:20px"></div>
        <span id="writting" hidden class="writting">${this.getAttribute('bot-name')} esta escribiendo...</span>
        <div style="display:flex;padding:10px;border-top:1px solid rgb(179, 179, 179);gap: 8px; margin-top: 8px">
          <input style="flex:1;outline:none" placeholder="Escribe...">
          <button id="submit-btn" class="btn">Enviar</button>
        </div>
      </div>
      <button id="float-btn" style="position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:var(--p);border:none;color:#fff;cursor:pointer">💬</button>
    `;
    this.shadowRoot.getElementById('float-btn').onclick = () => {
      this.open = !this.open;
      this.shadowRoot.getElementById('window').style.display = this.open ? 'flex' : 'none';
    };
    this.shadowRoot.getElementById('submit-btn').onclick = async () => {
      const waitResponse = this.shadowRoot.getElementById('writting');
      waitResponse.removeAttribute('hidden');
      await this.send()
      waitResponse.setAttribute('hidden', "")
    };
  }

  add(text, type) {
    const messageDiv = this.shadowRoot.getElementById('message');
    const botMsgDiv = document.createElement('div');
    botMsgDiv.textContent = text;
    if (type === 'user') {
      botMsgDiv.style.cssText = 'text-align:left';
      botMsgDiv.classList.add('usermessage');
    } else {
      botMsgDiv.style.cssText = 'text-align:left';
      botMsgDiv.classList.add('botmessage')
    }

    messageDiv.appendChild(botMsgDiv);
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }
}

if (!customElements.get('chatbot')) {
  customElements.define('chat-bot', Chatbot);
}
