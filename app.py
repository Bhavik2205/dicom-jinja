from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import os
import cv2
import numpy as np
import uuid
from flask_cors import CORS
from datetime import datetime
import base64
from io import BytesIO

# app = Flask(__name__)
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'dcm', 'jpg', 'png', 'tif', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to convert OpenCV image to base64
def image_to_base64(img):
    _, buffer = cv2.imencode('.jpg', img)
    img_str = base64.b64encode(buffer).decode('utf-8')
    return img_str

# Utility function to save a NumPy image to disk
def save_image(image, upload_date, prefix):
    # Generate a unique filename using UUID
    unique_id = str(uuid.uuid4())
    filename = f"{prefix}_{unique_id}.png"  # Save as PNG format
    date_folder = os.path.join(app.config['UPLOAD_FOLDER'], upload_date)
    
    # Create the folder if it doesn't exist
    os.makedirs(date_folder, exist_ok=True)
    
    # Save the image file
    filepath = os.path.join(date_folder, filename)
    cv2.imwrite(filepath, image)
    
    return filename, filepath

# Modified route to process uploaded images in-memory
@app.route('/process_enface', methods=['POST'])
def process_enface():
    try:
        # Create a list to store images
        images = []

        # Read each uploaded file directly into OpenCV
        for i in range(512):
            # Read file as bytes and convert to a NumPy array
            file = request.files[f'file{i}'].read()
            np_img = np.frombuffer(file, np.uint8)
            
            # Decode the image using OpenCV
            img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
            if img is None:
                return jsonify({'error': f"Image at index {i} could not be read."}), 400
            images.append(img)

        # Call enface processing module using in-memory images
        enface_image, contrast_image = perform_enface_processing(images)

         # Create a folder for the current date
        upload_date = datetime.now().strftime('%Y-%m-%d')
       
        # Save processed images to disk using the save_image function
        enface_filename, enface_filepath = save_image(enface_image, upload_date, 'enface')
        contrast_filename, contrast_filepath = save_image(contrast_image, upload_date, 'contrast')

        # Return the paths of the saved images in JSON response
        return jsonify({
            'enface_image_path': enface_filepath,
            'contrast_image_path': contrast_filepath
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Enface processing function that accepts in-memory images
def perform_enface_processing(images):
    height = width = 512
    enface_image = np.zeros((height, width, 3), float)
    
    # Compute enface image as before
    for i in range(len(images)):
        if images[i] is not None:
            enface_image[i, 0:512] = np.sum(images[i], axis=0) / 512

    # Normalize and increase contrast
    enface_image = cv2.normalize(enface_image, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
    enface_img_contrast = increase_brightness(enface_image)

    return enface_image, enface_img_contrast

def increase_brightness(img, value=40):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    lim = 255 - value
    v[v > lim] = 255
    v[v <= lim] += value
    final_hsv = cv2.merge((h, s, v))
    img = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)
    return img

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