# app.py
from flask import Flask, render_template, request, redirect, url_for, flash
import json
import os

# Initialize Flask app
# Flask by default looks for templates in a 'templates' folder
# and static files in a 'static' folder.
app = Flask(__name__)
app.secret_key = 'your_super_secret_key_here' # IMPORTANT: Change this to a strong, random key!

# Define the path to save contact submissions
CONTACT_SUBMISSIONS_FILE = 'contact_submissions.json'

# Ensure the contact submissions file exists
if not os.path.exists(CONTACT_SUBMISSIONS_FILE):
    with open(CONTACT_SUBMISSIONS_FILE, 'w') as f:
        json.dump([], f)

# Route to serve the homepage (index.html is now inside 'templates')
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve other HTML pages
# The <path:filename> converter captures the rest of the path as 'filename'
@app.route('/<path:filename>')
def serve_html_pages(filename):
    # This route attempts to render an HTML file from the 'templates' folder
    # We check if it's an HTML file to avoid conflicts with static files served by default.
    if filename.endswith('.html'):
        try:
            return render_template(filename)
        except Exception as e:
            # If the HTML file isn't found, return a 404
            print(f"Error serving HTML page {filename}: {e}")
            
            return "Page Not Found", 404
    # If it's not an HTML file, let Flask's default static file handler take over.
    # Flask automatically serves files from the 'static' folder under the /static URL.
    # E.g., /static/style.css, /static/script.js
    return app.send_static_file(filename) # This line is often not explicitly needed if static_folder is correctly configured and accessed via /static/


# Route to handle contact form submissions (AJAX/Fetch)
@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    if request.method == 'POST':
        data = request.json # Assuming frontend sends JSON

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return {"success": False, "message": "All fields are required."}, 400

        submission_data = {
            "name": name,
            "email": email,
            "message": message,
            "timestamp": data.get('timestamp')
        }

        try:
            with open(CONTACT_SUBMISSIONS_FILE, 'r+') as f:
                submissions = json.load(f)
                submissions.append(submission_data)
                f.seek(0)
                json.dump(submissions, f, indent=4)
                f.truncate()
            return {"success": True, "message": "Message received successfully!"}, 200
        except Exception as e:
            print(f"Error saving submission: {e}")
            return {"success": False, "message": "Server error saving data."}, 500

if __name__ == '__main__':
    # Flask finds 'templates' and 'static' folders automatically if they are
    # in the same directory as app.py. So, we remove the explicit template_folder/static_folder
    # configuration used previously for a flat structure.
    app.run(debug=True)