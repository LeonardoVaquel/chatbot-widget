import stylesText from './styles.css?inline';

class Chatbot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.sessionId = localStorage.getItem('m_id') || Math.random().toString(36).slice(2);
    localStorage.setItem('m_id', this.sessionId);
    this.isRendered = false;
  }

  connectedCallback() {
    if (!this.isRendered) {
      this.render();
      this.isRendered = true;
    }
  }

  static get observedAttributes() {
    return ['color', 'open'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'color' && newVal) {
      this.style.setProperty('--primary-color', newVal);
    }
  }

  toggleChat() {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    } else {
      this.setAttribute('open', '');
      const btn = this.shadowRoot.getElementById('float-btn');
      btn.classList.remove('unread');
    }
  }

  async send() {
    const userMsg = this.shadowRoot.querySelector('input');
    const userVal = userMsg.value.trim();
    const inputKey = this.getAttribute('input-key') || "chatInput";
    const outputKey = this.getAttribute('output-key') || "output";
    const bodyObj = { sessionId: this.sessionId };
    
    if (!userVal) return;
    
    this.add(userVal, 'user');
    userMsg.value = '';
    bodyObj[inputKey] = userVal;
  
    const waitResponse = this.shadowRoot.getElementById('writting');
    waitResponse.removeAttribute('hidden');

    try {
      const res = await fetch(this.getAttribute('url'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj)
      });
      
      if (!res.ok) throw new Error();

      const data = await res.json();
      const responseData = Array.isArray(data) ? data[0] : data;
      const isClosed = !this.hasAttribute('open');
      if (isClosed) {
        this.shadowRoot.getElementById('float-btn').classList.add('unread');
      }
      this.add(responseData[outputKey], 'bot');
      
    } catch (e) {
      this.add(this.getAttribute('service-off-msg') || 'Lo siento, en este momento no estoy disponible', 'bot');
    } finally {
      waitResponse.setAttribute('hidden', "");
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${stylesText}</style>
      <div class="win" id="window">
        <div class="chat_header">${this.getAttribute('bot-name') || 'Chat'}</div>
        <div class="response" id="message" style="flex:1;overflow:auto;padding:20px"></div>
        <span id="writting" hidden class="writting">${this.getAttribute('bot-name') || 'Chatbot'} está escribiendo...</span>
        <div tabindex="0" style="display:flex;padding:10px;border-top:1px solid rgb(179, 179, 179);gap: 8px; margin-top: 8px">
          <input tabindex="1" id="user-input" autofocus placeholder="${this.getAttribute('input-placeholder') || 'Escribe aquí...'}">
          <button tabindex="2" id="submit-btn" class="btn">Enviar</button>
        </div>
      </div>
      <button tabindex="0" id="float-btn" class="float-btn"></button>
    `;

    this.shadowRoot.getElementById('float-btn').onclick = () => this.toggleChat();
    
    this.shadowRoot.getElementById('submit-btn').onclick = () => this.send();

    this.shadowRoot.querySelector('input').onkeypress = (e) => {
      if (e.key === 'Enter') this.send();
    };
  }

  add(text, type) {
    const messageDiv = this.shadowRoot.getElementById('message');
    const msgDiv = document.createElement('div');
    msgDiv.textContent = text;
    msgDiv.classList.add(type === 'user' ? 'usermessage' : 'botmessage');
    messageDiv.appendChild(msgDiv);
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }
}

if (!customElements.get('chat-bot')) {
  customElements.define('chat-bot', Chatbot);
}