
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SetOutputToWaveFile("C:\Users\luisc\OneDrive\Documents\nodejs\pastel-radio-app\tmp\pastel_sara_test.wav")
$synth.Speak("Qué bonita mañana para arrancar desde Morelia , ocho y cuarto y ya con todo el ánimo. Luna Vidal nos trae Mareas del Sur, una rola que te va a entrar suavecito pero te va a dejar con ganas de más. Órale, Roberto, esto va para ti.")
$synth.Dispose()
