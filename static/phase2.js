// async function processFolder() {
//     const folderInput = document.getElementById('folderInput');
//     const files = Array.from(folderInput.files);

//     // Show the loader
//     document.getElementById('loader').style.display = 'block';

//     // Filter image files
//     const imageFiles = files.filter(file => /\.(jpg|jpeg|png|tiff|tif)$/i.test(file.name));

//     // Check for 512 images
//     if (imageFiles.length !== 512) {
//         alert(`Selected folder must contain exactly 512 images. Found: ${imageFiles.length}`);
//         document.getElementById('loader').style.display = 'none';
//         return;
//     }

//     // Extract extensions and convert to lowercase
//     const extensions = imageFiles.map(file => file.name.split('.').pop().toLowerCase());

//     // Check if all extensions are the same
//     const allSameExtension = extensions.every(ext => ext === extensions[0]);

//     if (!allSameExtension) {
//         alert(`All files must have the same extension. Found extensions: ${[...new Set(extensions)].join(', ')}`);
//         document.getElementById('loader').style.display = 'none';
//         return;
//     }

//     // Send files to the backend for processing
//     const formData = new FormData();
//     imageFiles.forEach((file, index) => formData.append(`file${index}`, file));

//     try {
//         // Call Flask backend endpoint to process images
//         const response = await fetch('/process_enface', {
//             method: 'POST',
//             body: formData
//         });

//         if (response.ok) {
//             const result = await response.json();
//             alert(`Processing complete! Images received from Module.`);

//             // Update the sidebar with new images
//             updateSidebar(result.enface_image_path, result.contrast_image_path);

//             // Hide the loader
//             document.getElementById('loader').style.display = 'none';
//         } else {
//             alert('An error occurred during processing.');
//             document.getElementById('loader').style.display = 'none';
//         }
//     } catch (error) {
//         alert('Failed to process images. Please try again later.');
//         console.error(error);
//         document.getElementById('loader').style.display = 'none';
//     }
// }

// // Initialize CornerstoneWADOImageLoader
// cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

// cornerstoneWADOImageLoader.configure({
//     useWebWorkers: true
// });

// // Register the WADO Image Loader
// cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);

// async function selectFolder() {
//     // Get the selected checkboxes
//     const selectedFiles = document.querySelectorAll('.image-checkbox:checked');

//     // Check if exactly one file is selected
//     if (selectedFiles.length === 0) {
//         alert('Please select one file from the preview.');
//         return; // Exit if no file is selected
//     } else if (selectedFiles.length > 1) {
//         alert('Please select only one file at a time.');
//         return; // Exit if more than one file is selected
//     }

//     // Only proceed if exactly one file is selected
//     let validDcmFiles = [];
//     const fileCheckbox = selectedFiles[0]; // Since there is only one file, use the first one

//     const fileUrl = fileCheckbox.parentElement.dataset.url; // Get the file URL from the checkbox's parent
//     const lowerCaseFileUrl = fileUrl.toLowerCase(); // Convert URL to lowercase for case-insensitive check
//     console.log({ lowerCaseFileUrl }); // Debugging log

//     if (lowerCaseFileUrl.endsWith('.dcm')) {
//         try {
//             // Use wadouri scheme for DICOM images
//             const imageId = `wadouri:${fileUrl}`;

//             // Load the DICOM image using Cornerstone
//             const image = await cornerstone.loadImage(imageId);

//             // Get the dataset from the loaded image
//             const dataSet = image.data;
//             const numFrames = parseInt(dataSet.string('x00280008')) || 1; // Parse number of frames, default to 1

//             // Validate the frame count
//             if (numFrames === 128 || numFrames === 256 || numFrames === 512) {
//                 const url = fileUrl
//                 validDcmFiles.push(url); // Add to valid DCM files
//                 console.log(`The file ${fileUrl} has a valid frame count of ${numFrames}.`);

//                 // Proceed to send the valid DICOM URL to the backend
//                 const response = await fetch('/process_enface', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ file_paths: [url] }),  // Send the URL(s) as a list in the body
//                 });

//                 const result = await response.json();
//                 if (response.ok) {
//                     console.log('Processing successful:', result);
//                     alert('Enface processing completed successfully.');
//                 } else {
//                     console.error('Error during processing:', result.error);
//                     alert(`Error: ${result.error}`);
//                 }

//             } else {
//                 alert(`The file ${fileUrl} has ${numFrames} frames, which is not valid. Valid frame counts are 128, 256, or 512.`);
//             }
//         } catch (error) {
//             alert(`Error fetching the file ${fileUrl}: ${error.message}`);
//         }
//     } else {
//         alert(`The file ${fileUrl} is not a DICOM (.dcm) file.`);
//     }

//     console.log('Valid DICOM file selected:', validDcmFiles);
// }

async function selectFolder() {
    // Get the selected checkboxes
    const selectedFiles = document.querySelectorAll('.image-checkbox:checked');

    // Check if exactly one file is selected
    if (selectedFiles.length === 0) {
        alert('Please select one file from the preview.');
        return; // Exit if no file is selected
    } else if (selectedFiles.length > 1) {
        alert('Please select only one file at a time.');
        return; // Exit if more than one file is selected
    }

    // Only proceed if exactly one file is selected
    let validDcmFiles = [];
    const fileCheckbox = selectedFiles[0]; // Since there is only one file, use the first one

    const fileUrl = fileCheckbox.parentElement.dataset.url; // Get the file URL from the checkbox's parent
    const lowerCaseFileUrl = fileUrl.toLowerCase(); // Convert URL to lowercase for case-insensitive check
    console.log({ lowerCaseFileUrl }); // Debugging log

    createCanvases('1x2');
    if (lowerCaseFileUrl.endsWith('.dcm')) {
        try {
            // Use wadouri scheme for DICOM images
            const imageId = `wadouri:${fileUrl}`;

            // Load the DICOM image using Cornerstone
            const image = await cornerstone.loadImage(imageId);

            // Get the dataset from the loaded image
            const dataSet = image.data;
            const numFrames = parseInt(dataSet.string('x00280008')) || 1; // Parse number of frames, default to 1
            // Validate the frame count
            if (numFrames === 128 || numFrames === 256 || numFrames === 512) {
                const url = fileUrl;
                validDcmFiles.push(url); // Add to valid DCM files
                console.log(`The file ${fileUrl} has a valid frame count of ${numFrames}.`);
                // Proceed to send the valid DICOM URL to the backend
                const response = await fetch('/process_enface', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ file_paths: [url] }),  // Send the URL(s) as a list in the body
                });
                const result = await response.json();
                if (response.ok) {
                    console.log('Processing successful:', result);
                    alert('Enface processing completed successfully.');
                    // Display the images in a 1x2 layout
                    displayImagesInLayout(fileUrl, result.enface_image_path);
                } else {
                    console.error('Error during processing:', result.error);
                    alert(`Error: ${result.error}`);
                }
            } else {
                alert(`The file ${fileUrl} has ${numFrames} frames, which is not valid. Valid frame counts are 128, 256, or 512.`);
            }
        } catch (error) {
            alert(`Error fetching the file ${fileUrl}: ${error.message}`);
        }
    } else {
        alert(`The file ${fileUrl} is not a DICOM (.dcm) file.`);
    }
    console.log('Valid DICOM file selected:', validDcmFiles);
}

