from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
import numpy as np
import uuid
from flask_cors import CORS
from datetime import datetime

# app = Flask(__name__)
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'dcm', 'jpg', 'png', 'tif', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    # Generate a unique filename using UUID
    unique_id = str(uuid.uuid4())
    file_extension = file.filename.rsplit('.', 1)[1].lower()
    
    # Create a folder for the current date
    upload_date = datetime.now().strftime('%Y-%m-%d')
    date_folder = os.path.join(app.config['UPLOAD_FOLDER'], upload_date)
    os.makedirs(date_folder, exist_ok=True)
    
    # Save the file with the unique ID
    filename = f"{unique_id}.{file_extension}"
    filepath = os.path.join(date_folder, filename)
    file.save(filepath)
    
    return upload_date, filename

@app.route('/')
def index():
    # Get the list of uploaded files grouped by date
    files_by_date = {}
    
    # Iterate through the date-based folders in the upload directory
    for date_folder in os.listdir(app.config['UPLOAD_FOLDER']):
        date_path = os.path.join(app.config['UPLOAD_FOLDER'], date_folder)
        if os.path.isdir(date_path):
            files_by_date[date_folder] = os.listdir(date_path)
    
    return render_template('index.html', files_by_date=files_by_date)
    # files = os.listdir(app.config['UPLOAD_FOLDER'])
    # return render_template('index.html', files=files)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file and allowed_file(file.filename):
        upload_date, filename = save_file(file)
        return redirect(url_for('index'))
        # filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        # file.save(filepath)
        # return redirect(url_for('index'))

@app.route('/uploads/<date>/<filename>')
def uploaded_file(date, filename):
    try:
        # date, file = filename.split('/')
        return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], date), filename)
        # return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print("error", e)
        app.logger.error(f"Error serving file: {e}")
        return "File not found", 404


@app.route('/dist/<filename>')
def serve_dist(filename):
    return send_from_directory('dist', filename)


if __name__ == '__main__':
    app.run(debug=True)