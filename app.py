import os
import uuid
import numpy as np
import pydicom
from pydicom.dataset import Dataset
from pydicom.uid import generate_uid
from PIL import Image
from flask_cors import CORS
import base64
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import cv2
from datetime import datetime
import re

# app = Flask(__name__)
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'dcm', 'jpg', 'png', 'jpeg'}

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
# Modified route to process uploaded DICOM file
@app.route('/process_enface', methods=['POST'])
def process_enface():
    try:
        # Get the file paths from the request
        file_paths = request.json.get('file_paths', [])
        if not file_paths:
            return jsonify({'error': "File paths are required."}), 400

        print(f"Processing files: {file_paths}")
        # Construct the absolute file path
        relative_file_path = file_paths[0]
        absolute_file_path = os.path.join(app.config['UPLOAD_FOLDER'], relative_file_path.lstrip('/uploads'))


        if not os.path.isfile(absolute_file_path):
            return jsonify({'error': f"File path '{absolute_file_path}' does not exist."}), 400

        match = re.search(r'/uploads/(\d{4}-\d{2}-\d{2})/', relative_file_path)
        if not match:
            return jsonify({'error': "Invalid file path format."}), 400
        upload_date = match.group(1)
        
        # Read the DICOM file
        dicom_data = pydicom.dcmread(absolute_file_path)
        pixel_data = dicom_data.pixel_array

        # Ensure the DICOM file contains exactly 512 frames
        if pixel_data.shape[0] != 512:
            return jsonify({'error': "DICOM file must contain exactly 512 frames."}), 400

        # Extract and resize frames from the pixel data
        images = []
        for i in range(512):
            image = pixel_data[i]
            resized_image = cv2.resize(image, (512, 512))
            images.append(resized_image)

        # Call enface processing module using in-memory images
        enface_image, contrast_image = perform_enface_processing(images)

        # Create a folder for the current date
        # upload_date = datetime.now().strftime('%Y-%m-%d')

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
            enface_image[i, :] = np.sum(images[i], axis=0) / 512

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

@app.route('/authenticate')
def authenticate():
    return render_template('authentication.html')

def convert_to_dcm(images, upload_date):
    current_date = datetime.now().strftime('%Y-%m-%d')
    uploads_dir = os.path.join('uploads', current_date)
    os.makedirs(uploads_dir, exist_ok=True)  # Create the directory if it does not exist

    # This function will contain the logic for converting images to DICOM
    dicomized_filename = os.path.join(uploads_dir, str(uuid.uuid4()) + '.dcm')
    
    # Create a new DICOM dataset
    ds = Dataset()
    ds.file_meta = Dataset()
    ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian
    ds.file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.14.1'  # Multi-frame True Color Image Storage
    ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()
    ds.file_meta.ImplementationClassUID = "1.2.3.4"

    # Add patient and study information
    ds.PatientName = "Test^Name"
    ds.PatientID = "00-000-000"
    ds.PatientBirthDate = "19900101"  # Format: YYYYMMDD
    ds.StudyDate = upload_date
    ds.StudyTime = datetime.now().strftime('%H%M%S.%f')
    ds.PatientSex = "O"  # 'O' for Other
    ds.Modality = "OT"  # 'OT' for Other modality
    ds.StudyID = "1"
    ds.SeriesNumber = 1

    # Set study description (shorter than 16 characters)
    study_description = pydicom.dataelem.DataElement(0x0008103E, 'SH', "Sample study")
    ds.add(study_description)

    # List to hold pixel data for all frames
    pixel_data_frames = []

    # Process each image in the input
    for img in images:
        
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Convert image to PIL format
        pil_image = Image.fromarray(img_rgb)

        # Convert to RGB if needed
        if pil_image.mode in ['L', 'RGBA']:
            pil_image = pil_image.convert('RGB')

        # Store the first frame's size for later use
        pixel_data_frames.append(pil_image)  # Store it temporarily to access its size later

    # Determine target size based on the first frame or default to (512, 512)
    if pixel_data_frames:
        first_frame_size = pixel_data_frames[0].size
        target_size = max(first_frame_size) if min(first_frame_size) > 0 else 512  # Ensure we have a valid size
        target_size = (max(target_size, 512), max(target_size, 512))  # Enforce a minimum size of 512x512
    else:
        target_size = (512, 512)  # Fallback in case no frames were added

    # Resize and pad images to the target size
    padded_frames = []
    for pil_image in pixel_data_frames:
        # Resize image while maintaining aspect ratio and padding with black
        pil_image.thumbnail(target_size, Image.ANTIALIAS)
        new_image = Image.new("RGB", target_size, (0, 0, 0))  # Create a black background
        new_image.paste(pil_image, ((target_size[0] - pil_image.width) // 2, 
                                      (target_size[1] - pil_image.height) // 2))

        # Convert padded image to numpy array
        np_frame = np.array(new_image)
        padded_frames.append(np_frame)

    # Check if there are frames to process
    if not padded_frames:
        raise ValueError("No valid frames found to create DICOM file.")

    # Set dimensions and other attributes for the DICOM file
    first_frame_shape = padded_frames[0].shape
    ds.Rows, ds.Columns = first_frame_shape[:2]
    ds.NumberOfFrames = len(padded_frames)

    if first_frame_shape[2] == 3:
        ds.PhotometricInterpretation = "RGB"
        ds.SamplesPerPixel = 3
    else:
        ds.PhotometricInterpretation = "MONOCHROME2"
        ds.SamplesPerPixel = 1

    # Set common DICOM pixel attributes
    ds.BitsStored = 8
    ds.BitsAllocated = 8
    ds.HighBit = 7
    ds.PixelRepresentation = 0
    ds.PlanarConfiguration = 0

    # Combine frames into a single pixel array for multi-frame DICOM
    multi_frame_pixel_data = b''.join(frame.tobytes() for frame in padded_frames)
    ds.PixelData = multi_frame_pixel_data

    # Set remaining attributes
    ds.SOPClassUID = '1.2.840.10008.5.1.4.1.1.14.1'
    ds.SOPInstanceUID = generate_uid()
    ds.StudyInstanceUID = generate_uid()
    ds.SeriesInstanceUID = generate_uid()

    ds.is_little_endian = True
    ds.is_implicit_VR = False

    # Save the multi-frame DICOM file
    ds.save_as(dicomized_filename, write_like_original=False)
    return dicomized_filename

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files and 'folderInput' not in request.files:
        return redirect(request.url)
    
    upload_type = request.form.get('uploadType')
    convert_option = request.form.get('convertOption', 'no')

    images_to_convert = []
    upload_date = datetime.now().strftime('%Y-%m-%d')  # Set the current date for uploads

    def read_image(file):
        # Read the file stream and convert it into a NumPy array
        file_bytes = np.frombuffer(file.read(), np.uint8)
        # Attempt to decode as a standard image
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if image is not None:
            return image
        return None

    def read_dicom(file):
        # Read DICOM file and extract pixel data
        dicom_data = pydicom.dcmread(file)
        return dicom_data.pixel_array

    if upload_type == 'files':
        files = request.files.getlist('file')  # Get a list of all uploaded files
        for file in files:
            if file and allowed_file(file.filename):
                if convert_option == 'yes':
                    # Check if the file is a DICOM file
                    if file.filename.lower().endswith('.dcm'):
                        try:
                            image_data = read_dicom(file)
                            if image_data is not None:
                                images_to_convert.append(image_data)
                                print(f"DICOM image read successfully: {file.filename} (shape: {image_data.shape})")
                        except Exception as e:
                            print(f"Error reading DICOM image from file: {file.filename}, Error: {e}")
                    else:
                        image = read_image(file)
                        if image is not None:
                            images_to_convert.append(image)
                            print(f"Image read successfully: {file.filename} (shape: {image.shape})")
                        else:
                            print(f"Error reading image from file: {file.filename}")
                else:
                    # Save the original file normally
                    upload_date, filename = save_file(file)

    elif upload_type == 'folder':
        folder_files = request.files.getlist('folderInput')  # Get files from folder upload
        for folder_file in folder_files:
            if folder_file and allowed_file(folder_file.filename):
                if convert_option == 'yes':
                    if folder_file.filename.lower().endswith('.dcm'):
                        try:
                            image_data = read_dicom(folder_file)
                            if image_data is not None:
                                images_to_convert.append(image_data)
                                print(f"DICOM image read successfully: {folder_file.filename} (shape: {image_data.shape})")
                        except Exception as e:
                            print(f"Error reading DICOM image from file: {folder_file.filename}, Error: {e}")
                    else:
                        image = read_image(folder_file)
                        if image is not None:
                            images_to_convert.append(image)
                            print(f"Image read successfully: {folder_file.filename} (shape: {image.shape})")
                        else:
                            print(f"Error reading image from file: {folder_file.filename}")
                else:
                    # Save the original file normally
                    upload_date, filename = save_file(folder_file)

    # Convert to DICOM only if there are images to convert
    if convert_option == 'yes' and images_to_convert:
        dcm_filename = convert_to_dcm(images_to_convert, upload_date)
        print(f"DICOM File Saved: {dcm_filename}")

    return redirect(url_for('index'))

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