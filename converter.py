import pydicom
from pydicom.dataset import Dataset, DataElement
from pydicom.uid import generate_uid
from PIL import Image
import numpy as np
import uuid
import datetime
import os

# Your input directory here
INPUT_DIR = r"C:\Users\BAPS\Downloads\onh_os_BScan_2023-11-11,18.05\sample"

# Name for output DICOM
dicomized_filename = str(uuid.uuid4()) + '.dcm'

# Get the current datetime
dt = datetime.datetime.now()

# Create DICOM from scratch
ds = Dataset()
ds.file_meta = Dataset()
ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian
ds.file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.1.1'  # Multi-frame image storage
ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()  # Unique SOP Instance UID
ds.file_meta.ImplementationClassUID = "1.2.3.4"

# Add additional patient and study information
ds.PatientName = "Test^Name"
ds.PatientID = "00-000-000"
ds.PatientBirthDate = "19900101"  # Format: YYYYMMDD
ds.StudyDate = dt.strftime('%Y%m%d')
ds.StudyTime = dt.strftime('%H%M%S.%f')
ds.PatientSex = "O"  # 'O' for Other
ds.Modality = "OT"  # 'OT' for Other modality
ds.StudyID = "1"
ds.SeriesNumber = 1

# Set the study description (must be <= 16 characters for VR SH)
study_description = DataElement(0x0008103E, 'SH', "Sample study")  # Short description
ds.add(study_description)  # Add the DataElement to the dataset

# List to hold the pixel data for all frames
pixel_data_frames = []

# Iterate through images in the input directory
for image_file in os.listdir(INPUT_DIR):
    if image_file.lower().endswith(('.png', '.jpg', '.jpeg')):
        image_path = os.path.join(INPUT_DIR, image_file)
        img = Image.open(image_path)

        print("Processing file: {} | Format: {} | Size: {}".format(image_file, img.format, img.size))

        # Convert image modes
        if img.format in ['PNG', 'BMP', 'JPEG', 'JPG']:
            img = img.convert('RGB')
        
        # Handle grayscale images
        if img.mode == 'L':
            img = img.convert('RGB')  # Convert grayscale to RGB

        # Convert image to numpy array
        np_frame = np.array(img)

        if np_frame.ndim == 3:
            pixel_data_frames.append(np_frame)
        else:
            print(f"Unsupported image mode for {image_file}: {img.mode}")

# Check if there are frames to process
if not pixel_data_frames:
    raise ValueError("No valid frames found to create DICOM file.")

# Get dimensions from the first frame
first_frame_shape = pixel_data_frames[0].shape
ds.Rows, ds.Columns = first_frame_shape[:2]
ds.NumberOfFrames = len(pixel_data_frames)

# Determine SamplesPerPixel
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

# Combine all frames into a single pixel array for multi-frame DICOM
multi_frame_pixel_data = b''.join(frame.tobytes() for frame in pixel_data_frames)
ds.PixelData = multi_frame_pixel_data

# Set remaining attributes for the multi-frame DICOM
ds.SOPClassUID = '1.2.840.10008.5.1.4.1.1.14.1'  # Multi-frame True Color Image Storage UID
ds.SOPInstanceUID = generate_uid()
ds.StudyInstanceUID = generate_uid()
ds.SeriesInstanceUID = generate_uid()

ds.is_little_endian = True
ds.is_implicit_VR = False

# Save the multi-frame DICOM file
ds.save_as(dicomized_filename, write_like_original=False)
print(f"Multi-frame DICOM saved successfully at: {dicomized_filename}")
