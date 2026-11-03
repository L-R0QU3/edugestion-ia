import os
from flask import Flask, jsonify, request

app = Flask(__name__)
SERVICE_TOKEN = os.getenv("AI_SERVICE_TOKEN", "internal_token")

def check_auth(req):
    return req.headers.get("X-Service-Token") == SERVICE_TOKEN

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ai/generate-evaluation")
def generate_evaluation():
    if not check_auth(request):
        return jsonify(error="Unauthorized"), 401
        
    body = request.get_json() or {}
    tema = body.get("topic", "General")
    cantidad = int(body.get("numQuestions", 3))
    
    preguntas = []
    for i in range(1, cantidad + 1):
        preguntas.append({
            "enunciado": f"Pregunta {i} sobre {tema}: Explique detalladamente el concepto {i}.",
            "tipo": "DESARROLLO"
        })
        
    return jsonify({
        "title": f"Evaluación de {tema}",
        "tema": tema,
        "questions": preguntas
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)