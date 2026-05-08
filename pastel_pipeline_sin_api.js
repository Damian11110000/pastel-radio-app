import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

dotenv.config();

const execAsync = promisify(exec);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "prompt-caching-2024-07-31"
  }
});

async function textToSpeechWindows(texto, outputPath) {
  const absolutePath = path.resolve(outputPath).replace(/\//g, '\\');
  
  // Limpiar caracteres conflictivos para PowerShell
  const textoLimpio = texto
    .replace(/—/g, ',')      // raya larga → coma
    .replace(/"/g, ' ')      // comillas tipográficas
    .replace(/"/g, ' ')      // comillas tipográficas
    .replace(/['"]/g, ' ');  // comillas simples/dobles restantes

  const scriptContent = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SetOutputToWaveFile("${absolutePath}")
$synth.Speak("${textoLimpio}")
$synth.Dispose()
`;

  const scriptPath = path.resolve('./tmp/tts.ps1');
  
  // UTF-8 con BOM — PowerShell lo lee correctamente con acentos
  const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
  const content = Buffer.from(scriptContent, 'utf8');
  fs.writeFileSync(scriptPath, Buffer.concat([bom, content]));

  const { stderr } = await execAsync(
    `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
  );

  if (stderr) console.error("[PowerShell error]:", stderr);
}

async function runPipeline() {
  try {

    /*const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: [
        {
          type: "text",
          text: `# IDENTIDAD
      Eres Sara, locutora estrella de Pastel Radio 91.3 FM...`,
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

    const saraTexto = `Qué bonita mañana para arrancar desde Morelia — ocho y cuarto y ya con todo el ánimo. Luna Vidal nos trae Mareas del Sur, una rola que te va a entrar suavecito pero te va a dejar con ganas de más. Órale, Roberto, esto va para ti.`;

    console.log("\n[Texto generado]:", saraTexto);

    // PASO 2: CONVERTIR A VOZ CON WINDOWS SAPI
    const outputPath = "./tmp/pastel_sara_test.wav";
    fs.mkdirSync("./tmp", { recursive: true });

    await textToSpeechWindows(saraTexto, outputPath);

    // PASO 3: CONFIRMACIÓN FINAL
    const palabras = saraTexto.trim().split(/\s+/).length;
    const duracionEstimada = Math.round(palabras / 2.5);

    console.log("\n=== PASTEL RADIO IA — PIPELINE TEST ===");
    console.log(`Texto generado:      ${saraTexto}`);
    console.log(`Audio guardado:      ${outputPath}`);
    console.log(`Duración aproximada: ${duracionEstimada} segundos`);
    console.log("Pipeline completado exitosamente.\n");
    exec(`explorer "${outputPath.replace(/\//g, '\\\\')}"`);

  } catch (error) {
    console.error("Hubo un error en el proceso:", error.message);
  }
}

runPipeline();