from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
import pydicom
# from PIL import Image
import numpy as np
from flask_cors import CORS

# app = Flask(__name__)
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'dcm', 'jpg', 'png', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return render_template('index.html', files=files)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file and allowed_file(file.filename):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        return redirect(url_for('index'))

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print("error", e)
        app.logger.error(f"Error serving file: {e}")
        return "File not found", 404


@app.route('/dist/<filename>')
def serve_dist(filename):
    return send_from_directory('dist', filename)


if __name__ == '__main__':
    app.run(debug=True)