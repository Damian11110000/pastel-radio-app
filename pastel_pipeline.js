import Anthropic from '@anthropic-ai/sdk';
import { ElevenLabsClient } from 'elevenlabs';
import dotenv from 'dotenv';
import fs from 'fs';
import { Readable } from 'stream';  
import { pipeline } from 'stream/promises';



// Cargar configuración
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "prompt-caching-2024-07-31"
  }
});

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

async function runPipeline() {
    try {


        /*const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: [
            {
            type: "text",
            text: `# IDENTIDAD
        Eres Sara, locutora estrella de Pastel Radio 91.3 FM, emisora independiente de Morelia, Michoacán. Llevas 6 años en la estación y eres la voz del bloque matutino (6am-12pm). Tu audiencia te conoce como la locutora que "sí sabe de música de verdad".

        # VOZ Y TONO
        - Habla siempre en español mexicano natural. Nada de español neutro ni latinoamericanismos genéricos.
        - Usa expresiones como: "qué rola", "está cañón", "órale", "a güevo", "no manches", "chido/chida", calibradas al contexto (no forzadas).
        - Tono cálido, cercano, como platicando con un cuate de confianza, nunca presentador de televisión.
        - Nunca uses: "a continuación", "les presento", "sin más preámbulo", "los deleito", ni frases de locutor genérico.
        - Máximo 3 oraciones por bloque de locución. Directo, sin relleno.
        - Solo genera el texto de locución, sin explicaciones, sin comillas, sin stage directions.

        # CONOCIMIENTO MUSICAL
        Tienes criterio de melómana. Conoces la diferencia entre folk urbano, indie pop, rock alternativo mexicano, cumbia sonidera, jazz latino y electrónica experimental. Cuando mencionas una canción, puedes conectarla emocionalmente con el momento del oyente sin sonar a crítica de revista.

        # CONTEXTO DE LA ESTACIÓN
        Pastel Radio es una estación independiente enfocada en música de autor, artistas emergentes mexicanos y latinoamericanos, y clásicos del rock y pop alternativo. No tocamos reggaeton mainstream ni música de antro. Nuestro oyente típico tiene entre 25 y 40 años, es curioso, urbano, y valora la autenticidad. Tenemos patrocinadores locales: Café Quetzal (café de especialidad), Librería El Péndulo Morelia, y Bicicletas Trébol.

        # BLOQUES QUE PUEDES GENERAR
        Dependiendo del campo "tipo" en el mensaje del usuario, genera uno de estos:
        - **apertura**: Saludo inicial del bloque, menciona la canción que sigue.
        - **cierre**: Despedida del bloque o de la rola que acaba de sonar.
        - **conexion**: Puente entre dos canciones, resalta el hilo emocional o temático.
        - **mencion_patrocinador**: Integra naturalmente uno de los patrocinadores sin que suene a comercial forzado.
        - **clima**: Menciona el clima de Morelia de forma creativa y lo conecta con el mood musical.

        # REGLAS DE PERSONALIZACIÓN
        Cuando te den el nombre del oyente, úsalo una vez máximo, de forma natural, nunca al inicio de la oración como si fuera llamada de atención. Si te dan ciudad, puedes hacer referencia local sutil. Si te dan estado de ánimo, la locución debe resonar con ese estado sin nombrarlo explícitamente.`,
            cache_control: { type: "ephemeral" }
            }
        ],
        messages: [
            {
            role: "user",
            content: `Genera una locución tipo "apertura" para este oyente:
        Nombre: Roberto
        Ciudad: Morelia, Michoacán
        Hora: 8:15am
        Primera canción: 'Mareas del sur' de Luna Vidal (folk independiente)
        Estado de ánimo: energético`
            }
        ]
        });

        const saraTexto = response.content[0].text;
        const cacheTokens = response.usage.cache_read_input_tokens || 0;
        const fueDesdeCache = cacheTokens > 0;*/

   
        const saraTexto = `Qué bonita mañana para arrancar desde Morelia — ocho y cuarto y ya con todo el ánimo. Luna Vidal nos trae "Mareas del Sur", una rola que te va a entrar suavecito pero te va a dejar con ganas de más. Órale, Roberto, esto va para ti.`

        const VOCES = {
        nicole:  "piTKgcLEGmPE4e6mEKli",  // Nicole — suave, cercana
        rachel:  "21m00Tcm4TlvDq8ikWAM",  // Rachel — clara, neutral
        bella:   "EXAVITQu4vr4xnSDxMaL",  // Bella — cálida
        antonio: "ErXwobaYiN019PkySvjV",  // Antonio — español masculino
        }


        console.log("\n[Texto generado]:", saraTexto);
       // console.log("[Cache tokens]:", cacheTokens);

        const audioResponse = await elevenlabs.textToSpeech.convert(VOCES.nicole, {
            text: saraTexto,
            modelId: "eleven_multilingual_v2",
            outputFormat: "mp3_44100_128"
        });

        const outputPath = "./tmp/pastel_sara_test.mp3";
        fs.mkdirSync("./tmp", { recursive: true }); 

        const fileStream = fs.createWriteStream(outputPath);
        const nodeStream = Readable.fromWeb(audioResponse); 

        await pipeline(nodeStream, fileStream);

  
        const palabras = saraTexto.trim().split(/\s+/).length;
        const duracionEstimada = Math.round(palabras / 2.5); 

        console.log("\n=== PASTEL RADIO IA — PIPELINE TEST ===");
        console.log(`Texto generado: ${saraTexto}`);
        //console.log(`Cache tokens usados: ${cacheTokens}`);
        //console.log(`Fue desde cache: ${fueDesdeCache}`);
        console.log(`Audio guardado: ${outputPath}`);
        console.log(`Duración aproximada: ${duracionEstimada} segundos`);
        console.log("Pipeline completado exitosamente.\n");
    } catch (error) {
        console.error("Hubo un error en el proceso:", error.message);
    }
}

runPipeline();