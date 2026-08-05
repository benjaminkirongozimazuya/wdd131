import os
import random
from datetime import datetime
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

QUIZ_DATA = {
    "enfants": [
        {"id": 1, "question": "Quel animal fait 'Meow' ?", "options": ["Chien", "Chat", "Vache", "Oiseau"], "answer": "Chat"},
        {"id": 2, "question": "De quelle couleur est une banane mûre ?", "options": ["Bleue", "Rouge", "Jaune", "Verte"], "answer": "Jaune"},
        {"id": 3, "question": "Combien de pattes a une araignée ?", "options": ["6", "8", "10", "4"], "answer": "8"},
        {"id": 4, "question": "Quel est le fruit préféré des singes ?", "options": ["Pomme", "Banane", "Orange", "Fraise"], "answer": "Banane"},
        {"id": 5, "question": "Lequel de ces animaux vit dans l'eau ?", "options": ["Poisson", "Lapin", "Lion", "Aigle"], "answer": "Poisson"},
        {"id": 6, "question": "Quelle est la couleur du ciel par une journée ensoleillée ?", "options": ["Vert", "Bleu", "Jaune", "Violet"], "answer": "Bleu"},
        {"id": 7, "question": "Quel est l'inverse de 'Chaud' ?", "options": ["Grand", "Froid", "Petit", "Lourd"], "answer": "Froid"}
    ],
    "adultes": [
        {"id": 1, "question": "Quelle est la capitale du Canada ?", "options": ["Toronto", "Vancouver", "Ottawa", "Montréal"], "answer": "Ottawa"},
        {"id": 2, "question": "Quel élément chimique a pour symbole 'Au' ?", "options": ["Argent", "Or", "Cuivre", "Aluminium"], "answer": "Or"},
        {"id": 3, "question": "Quel est le plus grand océan de la Terre ?", "options": ["Atlantique", "Indien", "Arctique", "Pacifique"], "answer": "Pacifique"},
        {"id": 4, "question": "Qui a écrit 'Les Misérables' ?", "options": ["Émile Zola", "Victor Hugo", "Gustave Flaubert", "Molière"], "answer": "Victor Hugo"},
        {"id": 5, "question": "Combien de planètes composent le système solaire ?", "options": ["7", "8", "9", "10"], "answer": "8"},
        {"id": 6, "question": "Quel est le plus long fleuve du monde ?", "options": ["Amazone", "Nil", "Mississippi", "Yangtsé"], "answer": "Amazone"},
        {"id": 7, "question": "Quelle est la monnaie officielle du Japon ?", "options": ["Yuan", "Yen", "Won", "Dollar"], "answer": "Yen"}
    ],
    "seniors": [
        {"id": 1, "question": "En quelle année l'homme a-t-il marché sur la Lune ?", "options": ["1965", "1969", "1972", "1975"], "answer": "1969"},
        {"id": 2, "question": "Qui a peint 'La Joconde' ?", "options": ["Léonard de Vinci", "Picasso", "Claude Monet", "Van Gogh"], "answer": "Léonard de Vinci"},
        {"id": 3, "question": "Quel général a prononcé l'Appel du 18 juin 1940 ?", "options": ["Pétain", "De Gaulle", "Leclerc", "Foch"], "answer": "De Gaulle"},
        {"id": 4, "question": "Dans quel pays se trouve le Taj Mahal ?", "options": ["Égypte", "Inde", "Turquie", "Maroc"], "answer": "Inde"},
        {"id": 5, "question": "Qui interprétait la chanson 'La Vie en rose' ?", "options": ["Édith Piaf", "Dalida", "Brigitte Bardot", "Mireille Mathieu"], "answer": "Édith Piaf"},
        {"id": 6, "question": "En quelle année a été détruit le mur de Berlin ?", "options": ["1989", "1991", "1985", "1979"], "answer": "1989"}
    ]
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/questions/<category>", methods=["GET"])
def get_questions(category):
    all_questions = QUIZ_DATA.get(category, [])
    if not all_questions:
        return jsonify([])

    sample_size = min(5, len(all_questions))
    selected_questions = random.sample(all_questions, sample_size)

    questions_to_send = []
    for q in selected_questions:
        q_copy = q.copy()
        options = q_copy["options"].copy()
        random.shuffle(options)
        q_copy["options"] = options
        questions_to_send.append(q_copy)

    response = jsonify(questions_to_send)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

@app.route("/api/save-response", methods=["POST"])
def save_response():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Aucune donnée envoyée"}), 400

    category = data.get("category", "Inconnue")
    question = data.get("question", "")
    user_answer = data.get("user_answer", "")
    correct_answer = data.get("correct_answer", "")
    is_correct = "Correct" if user_answer == correct_answer else "Incorrect"

    os.makedirs("reponses", exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    file_path = os.path.join("reponses", "reponses.txt")
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] Catégorie: {category} | Question: {question} | Réponse Utilisateur: {user_answer} | Résultat: {is_correct}\n")

    return jsonify({"message": "Réponse enregistrée avec succès !"}), 200

if __name__ == "__main__":
    app.run(debug=True)