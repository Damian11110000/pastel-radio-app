# 🎙️ Pastel Radio IA — Pipeline TTS

Genera locuciones de radio con voz artificial usando Claude (generación de texto) y ElevenLabs (texto a voz).

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- Cuenta en [Anthropic](https://console.anthropic.com/) con créditos
- Cuenta en [ElevenLabs](https://elevenlabs.io/) con créditos

---

## Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/damian11110000/pastel-radio-app.git
cd pastel-radio-app
```

### 2. Instalar dependencias

```bash
npm install @anthropic-ai/sdk elevenlabs dotenv
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

Agrega tus credenciales:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx
```

#### ¿Dónde conseguir las API Keys?

| Servicio | URL |
|---|---|
| Anthropic (Claude) | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| ElevenLabs | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |

### 4. EJECUTAR
node pastel_pipeline.js 