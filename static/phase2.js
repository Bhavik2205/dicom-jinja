// Trigger folder input dialog
function selectFolder() {
    document.getElementById('folderInput').click();
}

async function processFolder() {
    const folderInput = document.getElementById('folderInput');
    const files = Array.from(folderInput.files);

    // Show the loader
    document.getElementById('loader').style.display = 'block';

    // Filter image files
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|tiff|tif)$/i.test(file.name));

    // Check for 512 images
    if (imageFiles.length !== 512) {
        alert(`Selected folder must contain exactly 512 images. Found: ${imageFiles.length}`);
        document.getElementById('loader').style.display = 'none';
        return;
    }

    // Extract extensions and convert to lowercase
    const extensions = imageFiles.map(file => file.name.split('.').pop().toLowerCase());

    // Check if all extensions are the same
    const allSameExtension = extensions.every(ext => ext === extensions[0]);

    if (!allSameExtension) {
        alert(`All files must have the same extension. Found extensions: ${[...new Set(extensions)].join(', ')}`);
        document.getElementById('loader').style.display = 'none';
        return;
    }

    // Send files to the backend for processing
    const formData = new FormData();
    imageFiles.forEach((file, index) => formData.append(`file${index}`, file));

    try {
        // Call Flask backend endpoint to process images
        const response = await fetch('/process_enface', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`Processing complete! Images received from Module.`);

            // Update the sidebar with new images
            updateSidebar(result.enface_image_path, result.contrast_image_path);

            // Hide the loader
            document.getElementById('loader').style.display = 'none';
        } else {
            alert('An error occurred during processing.');
            document.getElementById('loader').style.display = 'none';
        }
    } catch (error) {
        alert('Failed to process images. Please try again later.');
        console.error(error);
        document.getElementById('loader').style.display = 'none';
    }
    // // Call Flask backend endpoint to process images
    // const response = await fetch('/process_enface', {
    //     method: 'POST',
    //     body: formData
    // });

    // if (response.ok) {
    //     const result = await response.json();
    //     console.log(result);
    //     alert(`Processing complete! Images received from Module.`);

    //     // Display the result (optional)
    //     const enfaceImage = document.createElement('img');
    //     enfaceImage.src = `data:image/jpeg;base64,${result.enface_image}`;
    //     document.body.appendChild(enfaceImage);

    //     const contrastImage = document.createElement('img');
    //     contrastImage.src = `data:image/jpeg;base64,${result.contrast_image}`;
    //     document.body.appendChild(contrastImage);

    // } else {
    //     alert('An error occurred during processing.');
    // }
}

// Function to update the sidebar dynamically with new images
function updateSidebar(enfaceImagePath, contrastImagePath) {
    const previewList = document.getElementById('previewList');

    // Create a new entry for Enface Image
    const enfaceDiv = document.createElement('div');
    enfaceDiv.className = 'previewSquare';
    enfaceDiv.style = 'flex: 0 1 calc(33.33% - 0px); max-width: calc(33.33% - 0px); height: calc(33.33% - 0px); border: 1px solid #ccc; padding: 0px; text-align: center; box-sizing: border-box;';
    enfaceDiv.innerHTML = `
        <div class="draggable" draggable="true" data-url="${enfaceImagePath}">
            <img src="${enfaceImagePath}" style="width: 100%; height: 100%; object-fit: cover;" alt="Enface Image">
        </div>`;
    previewList.appendChild(enfaceDiv);

    // Create a new entry for Contrast Image
    const contrastDiv = document.createElement('div');
    contrastDiv.className = 'previewSquare';
    contrastDiv.style = 'flex: 0 1 calc(33.33% - 0px); max-width: calc(33.33% - 0px); height: calc(33.33% - 0px); border: 1px solid #ccc; padding: 0px; text-align: center; box-sizing: border-box;';
    contrastDiv.innerHTML = `
        <div class="draggable" draggable="true" data-url="${contrastImagePath}">
            <img src="${contrastImagePath}" style="width: 100%; height: 100%; object-fit: cover;" alt="Contrast Image">
        </div>`;
    previewList.appendChild(contrastDiv);
}