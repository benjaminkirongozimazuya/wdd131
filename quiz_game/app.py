from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Base de données de questions classées par tranche d'âge
QUIZ_DATA = {
    "enfants": [
        {
            "id": 1,
            "question": "Quel animal fait 'Meow' ?",
            "options": ["Chien", "Chat", "Vache", "Oiseau"],
            "answer": "Chat"
        },
        {
            "id": 2,
            "question": "De quelle couleur est une banane mûre ?",
            "options": ["Bleue", "Rouge", "Jaune", "Verte"],
            "answer": "Jaune"
        }
    ],
    "adultes": [
        {
            "id": 1,
            "question": "Quelle est la capitale du Canada ?",
            "options": ["Toronto", "Vancouver", "Ottawa", "Montréal"],
            "answer": "Ottawa"
        },
        {
            "id": 2,
            "question": "Quel élément chimique a pour symbole 'Au' ?",
            "options": ["Argent", "Or", "Cuivre", "Aluminium"],
            "answer": "Or"
        }
    ],
    "seniors": [
        {
            "id": 1,
            "question": "En quelle année l'homme a-t-il marché sur la Lune ?",
            "options": ["1965", "1969", "1972", "1975"],
            "answer": "1969"
        },
        {
            "id": 2,
            "question": "Qui a peint 'La Joconde' ?",
            "options": ["Léonard de Vinci", "Picasso", "Claude Monet", "Van Gogh"],
            "answer": "Léonard de Vinci"
        }
    ]
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/questions/<category>")
def get_questions(category):
    questions = QUIZ_DATA.get(category, [])
    return jsonify(questions)

if __name__ == "__main__":
    app.run(debug=True)