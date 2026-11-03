import os
import json
from flask import Flask, jsonify, request

app = Flask(__name__)
SERVICE_TOKEN = os.getenv("AI_SERVICE_TOKEN", "internal_token")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Inicialización segura del cliente OpenAI
client = None
if OPENAI_API_KEY and OPENAI_API_KEY.strip():
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY.strip())
        print("OpenAI inicializado correctamente.")
    except Exception as e:
        print(f"Error al inicializar OpenAI (Revisa tu API Key): {e}")
        client = None

def check_auth(req):
    return req.headers.get("X-Service-Token") == SERVICE_TOKEN

@app.get("/health")
def health():
    return {"status": "ok", "ai_mode": "real" if client else "mock"}

@app.post("/ai/generate-evaluation")
def generate_evaluation():
    if not check_auth(request):
        return jsonify(error="Unauthorized"), 401
        
    body = request.get_json() or {}
    tema = body.get("topic", "General")
    cantidad = int(body.get("numQuestions", 3))
    
    if client:
        try:
            prompt = f"""
            Actúa como un profesor experto. Genera una evaluación sobre el tema: "{tema}".
            Necesito exactamente {cantidad} preguntas de desarrollo.
            Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
            {{
                "title": "Evaluación de {tema}",
                "questions": [
                    {{"enunciado": "Texto de la pregunta 1", "tipo": "DESARROLLO"}},
                    {{"enunciado": "Texto de la pregunta 2", "tipo": "DESARROLLO"}}
                ]
            }}
            """
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Eres un asistente que solo responde con JSON válido, sin texto adicional."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" },
                temperature=0.7
            )
            
            data = json.loads(response.choices[0].message.content)
            return jsonify(data)
            
        except Exception as e:
            print(f"Error llamando a OpenAI: {e}")
            # Si falla, cae al modo mock
    
    # MODO MOCK (Si no hay llave o falló)
    preguntas = []
    for i in range(1, cantidad + 1):
        preguntas.append({
            "enunciado": f"Pregunta {i} sobre {tema}: Explique detalladamente el concepto {i}.",
            "tipo": "DESARROLLO"
        })
        
    return jsonify({
        "title": f"Evaluación de {tema} (Modo Prueba)",
        "tema": tema,
        "questions": preguntas
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)