# @leonardovaq/chatbot-widget 🚀

Un Web Component ligero, sin dependencias y ultra optimizado para conectar cualquier sitio web con tu instancia de **n8n AI** o cualquier **API REST**.

## Características

- ⚡ **Zero Dependencies:** Hecho con Vanilla JS y Shadow DOM.
- 📦 **Nativo:** Funciona en React, Vue, Angular o HTML puro.
- 🎨 **Personalizable:** Cambia colores y nombres mediante atributos.
- 🧠 **Persistencia:** Gestiona sesiones automáticamente para mantener la memoria del chat (Postgres Ready).

## Instalación

```bash
npm install @leonardovaq/chatbot-widget
```

O vía CDN:

```html
<script type="module" src="https://unpkg.com/@leonardovaq/chatbot-widget/dist/chatbot-widget.js"></script>
```

## Uso Básico  

```html
<chat-bot 
    url="https://tu-n8n.com/webhook/chat"
    bot-name="Chatbot Widget"
    input-key="chatInput"
    output-key="output">
</chat-bot>
```

## Personalización Completa  

Puedes configurar el comportamiento mediante los **Atributos** y el diseño visual mediante las **Variables CSS**  

1. **Atributos (Configuración)**  

| **Atributo** | **Descripción** | **Default** |
|--|--|--|
| `url` | URL del Webhook de n8n (o API externa). | `""` |
| `bot-name` | Nombre que aparecerá en el header y avisos. | `"Chat"` |
| `input-key` | La key del JSON body que espera tu server con el mensaje del usuario. | `"chatInput"` |
| `output-key` | La key del JSON donde el server devuelve la respuesta al cliente. | `"output"` |
| `input-placeholder` | El placeholder del text input | `"Escribe aquí..."` |
| `service-off-msg` | Mensaje de error si la API falla con (500/429). | `"Lo siento, en este momento no estoy disponible"` |
| `open` | (Booleano) Si está habilitado, el chat inicia abierto. | `false` |
  
  
 2. **Variables CSS (Diseño)**  
 
 ```css
chat-bot {
  /* Fuentes y General */
  --chat-font-family: 'Inter', sans-serif;
  --primary-color: #f7d621;
  --text-color: #2b2a2a;
  --bg-window: #f4f4f4;

  /* Mensajes dentro de la ventana del chat */
  --bg-bot-msg-color: #f7d621;
  --text-bot-color: #2b2a2a;
  --bg-user-color: #f8eca8;
  --text-user-color: #2b2a2a;

  /* Botón Flotante */
  --float-btn-content: "💬";
  --float-btn-close-content: "✕";
  --float-btn-content-size: 18px;
  --unread-indicator-color: #ff4444;
}
```  

## Integración con n8n  

Este widget envía un objeto JSON con la siguiente estructura:  

```json
{
  "chatInput": "Hola!",
  "sessionId": "a1b2c3d4..."
}
```  

**Tip de n8n:** Asegurate de que tu nodo Webhook tenga como configuración: `Respond: When Last Node Finishes` y `Response Data: Last Node Output`  

## Contribuir  

Si tienes ideas para nuevas animaciones o funcionalidades, ¡sentite libre de abrir un PR!  

**hecho con 💙 por [Leonardo](https://github.com/LeonardoVaquel)**
