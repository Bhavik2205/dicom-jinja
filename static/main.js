// Global variable to store current images in canvases
let storedImages = {};  // Format: { "canvas-0-0": "imageId1", "canvas-0-1": "imageId2", ... }

window.addEventListener('load', function () {
    // Fetch all the preview elements
    const previewElements = document.querySelectorAll('[id^="preview-"]');
    console.log("Preview Elements:", previewElements);
    // Iterate over the preview elements
    previewElements.forEach((element) => {
        cornerstone.enable(element);

        // const dataUrl = element.parentElement.getAttribute('data-url');
        const parentDiv = element.parentElement;
        // Set the parent div to relative positioning if not already set
        parentDiv.style.position = 'relative';

        // Get the file name from the parent element's content
        const dataUrl = parentDiv.getAttribute('data-url');
        console.log("File Name:", dataUrl);
        const filename = dataUrl.split('/').pop();
        const extension = filename.split('.').pop().toLowerCase();

        let imageId = '';
        if (extension === 'dcm') {
            imageId = 'wadouri:' + dataUrl; // Use wadouri for DICOM
        } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
            imageId = `http://localhost:5000/${dataUrl}`; // Use webimage for PNG, JPG
        } else {
            console.error('Unsupported file format:', extension);
            return;
        }

        console.log({ imageId });

        cornerstone.loadImage(imageId).then((image) => {
            console.log('Image loaded successfully:', image);

            cornerstone.displayImage(element, image);
            // Create a transparent overlay div to block interaction
            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'overlay';
            overlayDiv.style.position = 'absolute';
            overlayDiv.style.top = '0'; // Aligns with top of the canvas
            overlayDiv.style.left = '0'; // Aligns with left of the canvas
            overlayDiv.style.width = element.offsetWidth + 10 + 'px';
            overlayDiv.style.height = element.offsetHeight + 'px';
            overlayDiv.style.backgroundColor = 'transparent'; // Transparent overlay
            overlayDiv.style.zIndex = '10'; // Ensure it's on top of the canvas

            // Append the overlayDiv to the parent container of the canvas
            parentDiv.appendChild(overlayDiv);
        }).catch((error) => {
            console.error('Error loading image:', error);
        });
    })
});

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded event triggered");

    const checkboxes = document.querySelectorAll(".image-checkbox");
    const maxSelection = 9;  // Maximum number of checkboxes that can be selected

    // Attach event listener to each checkbox
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            // Get all selected checkboxes
            const selectedCheckboxes = document.querySelectorAll(".image-checkbox:checked");

            // If the number of selected checkboxes exceeds the limit, uncheck the current one
            if (selectedCheckboxes.length > maxSelection) {
                alert("You can select a maximum of 9 images.");
                checkbox.checked = false;  // Uncheck the current checkbox
            }
        });
    });
    // Configure CornerstoneWADOImageLoader to use the web worker
    const config = {
        useWebWorkers: true,
        webWorkerPath: "https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoaderWebWorker.min.js", // Correct path
        taskConfiguration: {
            'decodeTask': {
                codecsPath: 'https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoaderCodecs.min.js'
            }
        }
    };

    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstoneFileImageLoader.external.cornerstone = cornerstone
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.cornerstoneTools = cornerstoneTools;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
    cornerstoneTools.init([
        {
            moduleName: 'globalConfiguration',
            configuration: {
                showSVGCursors: true,
                targetElement: '#dicomViewerContainer'
            },
        },
        {
            moduleName: 'segmentation',
            configuration: {
                outlineWidth: 2,
            },
        },
    ]);

    // Activate tools on button click
    document.getElementById('activateWwwc').addEventListener('click', function () {
        console.log("Window/Level tool activated");
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);  // Window/Level tool
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
    });

    document.getElementById('activateRotate').addEventListener('click', function () {
        console.log("Rotate tool activated");
        cornerstoneTools.addTool(cornerstoneTools.RotateTool)
        cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 1 })
    });

    document.getElementById('activateZoom').addEventListener('click', function () {
        console.log("Zoom tool activated");
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
    });

    document.getElementById('activateMagnify').addEventListener('click', function () {
        console.log("Magnify tool activated");
        cornerstoneTools.addTool(cornerstoneTools.MagnifyTool)
        cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 1 })
    });

    document.getElementById('activatePan').addEventListener('click', function () {
        console.log("Pan tool activated");
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
    });

    document.getElementById('activateLength').addEventListener('click', function () {
        console.log("Length tool activated");
        cornerstoneTools.addTool(cornerstoneTools.LengthTool);
        cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
    });

    document.getElementById('activateAngle').addEventListener('click', function () {
        console.log("Angle tool activated");
        cornerstoneTools.addTool(cornerstoneTools.AngleTool);
        cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
    });

    document.getElementById('activateRectangle').addEventListener('click', function (e) {
        console.log("RectangleRoi tool activated");
        cornerstoneTools.addTool(cornerstoneTools.RectangleRoiTool)
        cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 })
    });

    document.getElementById('activateCircle').addEventListener('click', function (e) {
        console.log("CircleRoi tool activated");
        cornerstoneTools.addTool(cornerstoneTools.CircleRoiTool)
        cornerstoneTools.setToolActive('CircleRoi', { mouseButtonMask: 1 })
    });

    document.getElementById('activateElliptical').addEventListener('click', function (e) {
        console.log("EllipticalRoi tool activated");
        cornerstoneTools.addTool(cornerstoneTools.EllipticalRoiTool)
        cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 })
    });

    document.getElementById('activateArrowAnnotate').addEventListener('click', function (e) {
        console.log("ArrowAnnotate tool activated");
        cornerstoneTools.addTool(cornerstoneTools.ArrowAnnotateTool)
        cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 })
    });

    //NOT WORKING
    document.getElementById('activateCobbAngle').addEventListener('click', function (e) {
        console.log("Cobb Angle tool activated");
        cornerstoneTools.addTool(cornerstoneTools.CobbAngleTool)
        cornerstoneTools.setToolActive('CobbAngle', { mouseButtonMask: 1 })
    });

    document.getElementById('activateErase').addEventListener('click', function (e) {
        console.log("Erase tool activated");
        cornerstoneTools.addTool(cornerstoneTools.EraserTool)
        cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 })
    });

    document.getElementById('activateCine').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        cornerstoneTools.playClip(selectedCanvas, 15);
        console.log('Active Tools:', cornerstoneTools.getActiveTools);
    });

    document.getElementById('activateInvert').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        cornerstone.enable(selectedCanvas);
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(selectedCanvas, viewport);
    });

    document.getElementById('activateCrosshair').addEventListener('click', function (e) {
        activateReferenceLinesAndCrosshairs();
    })

    document.getElementById('resetTools').addEventListener('click', function () {
        const selectedCanvas = document.querySelector('.selected');
        if (selectedCanvas) {
            cornerstone.reset(selectedCanvas);
        } else {
            alert('Please select a canvas first.');
        }
    });

    document.getElementById('activateStackScroll').addEventListener('click', function (e) {
        cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
        const selectedCanvas = document.querySelector('.selected');
        console.log({ selectedCanvas });
        cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1, frameRate: 1 });
        if (selectedCanvas) {
            cornerstoneTools.getToolState('StackScrollMouseWheel').isMouseWheelActive = true;
            cornerstoneTools.setToolActiveForElement(selectedCanvas, 'StackScrollMouseWheel');
        }
        // cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1, frameRate: 1 });
        console.log('Active Tools:', cornerstoneTools.getActiveTools);
    });

    document.getElementById('saveToolData').addEventListener('click', function () {
        const selectedCanvas = document.querySelector('.selected');  // Get the currently selected canvas
        if (selectedCanvas) {
            const toolState = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();  // Get tool state for the current canvas
            console.log({ toolState });
            const imageId = cornerstone.getEnabledElement(selectedCanvas).image.imageId;  // Get the current imageId
            const imageToolState = toolState[imageId];  // Get the tool state data for the specific image
    
            // Convert to JSON and save (could be to a server, localStorage, etc.)
            const toolStateJSON = JSON.stringify(imageToolState);
            localStorage.setItem('savedToolData', toolStateJSON);  // Save to localStorage for simplicity
            console.log("Tool data saved:", toolStateJSON);
        } else {
            alert('Please select a canvas first.');
        }
    });

    document.getElementById('loadToolData').addEventListener('click', function () {
        const selectedCanvas = document.querySelector('.selected');  // Get the currently selected canvas
        if (selectedCanvas) {
            const savedToolData = localStorage.getItem('savedToolData');  // Retrieve the saved tool data from localStorage
    
            if (savedToolData) {
                const parsedToolData = JSON.parse(savedToolData);  // Parse the saved tool data
                const imageId = cornerstone.getEnabledElement(selectedCanvas).image.imageId;  // Get the current imageId
    
                // Load the parsed tool data into the tool state manager for the specific image
                const toolState = { [imageId]: parsedToolData };
                cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(toolState);
                cornerstone.updateImage(selectedCanvas);  // Refresh the image to show the restored data
                console.log("Tool data loaded successfully");
            } else {
                alert('No tool data found to load.');
            }
        } else {
            alert('Please select a canvas first.');
        }
    });
    
});


function toggleMoreButtons() {
    const moreMenu = document.getElementById('moreMenu');
    if (moreMenu.classList.contains('hidden')) {
        moreMenu.classList.remove('hidden');
        // moreMenu.classList.add('show');
    } else {
        // moreMenu.classList.remove('show');
        moreMenu.classList.add('hidden');
    }
}

function toggleLayoutButton() {
    const layout = document.getElementById('dropdownContent');
    console.log(layout);
    if (layout.classList.contains('hidden')) {
        layout.classList.remove('hidden');
    } else {
        layout.classList.add('hidden');
    }
}

document.querySelectorAll('.icon-button').forEach(button => {
    // cornerstoneTools.stopClip();
    button.addEventListener('click', () => {
        if (button.id !== 'activateEnface' && button.id !== 'moreButton' && button.id !== 'addFile' && button.id !== 'resetTools' && button.id !== 'layout' && button.id !== 'lRotate' && button.id !== 'rRotate' && button.id !== 'hFlip' && button.id !== 'vFlip' && button.id !== 'activateInvert') {
            button.classList.add('active'); // Add active class first
            document.querySelectorAll('.icon-button').forEach(btn => {
                if (btn !== button) { // Only remove active from other buttons
                    btn.classList.remove('active');
                }
            });
        }
    });
});


// Function to toggle between file and folder upload
function toggleUploadType() {
    const fileUploadSection = document.getElementById('fileUploadSection');
    const folderUploadSection = document.getElementById('folderUploadSection');

    // Check which radio button is selected
    const selectedUploadType = document.querySelector('input[name="uploadType"]:checked').value;

    if (selectedUploadType === 'files') {
        fileUploadSection.style.display = 'block';
        folderUploadSection.style.display = 'none';
    } else {
        fileUploadSection.style.display = 'none';
        folderUploadSection.style.display = 'block';
    }
}

// Show the modal
document.getElementById('addFile').addEventListener('click', function () {
    document.getElementById('uploadModal').classList.remove('hidden');
});


// Close the modal
function closeModal() {
    console.log("Closing modal");
    document.getElementById('uploadModal').classList.add('hidden');
}

function createCanvases(layout) {
    console.log(layout);
    const [rows, cols] = layout.split('x').map(Number);
    const dicomViewerContainer = document.getElementById('dicomViewerContainer');
    dicomViewerContainer.innerHTML = '';  // Clear existing canvases

    let newCanvasIds = [];  // Store new canvas IDs based on the new layout

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const div = document.createElement('div');
            div.className = 'dicomViewer';
            div.style.width = `${100 / cols}%`;
            div.style.height = `${100 / rows}%`;
            div.style.border = '1px solid white';
            div.style.boxSizing = 'border-box';
            div.style.position = 'relative';  // For absolute positioning of details

            // Assign unique IDs for each canvas
            const uniqueId = `canvas-${i}-${j}`;
            div.setAttribute('id', uniqueId);  // Assign a unique ID to each canvas div

            newCanvasIds.push(uniqueId);  // Keep track of new canvas IDs

            div.innerHTML = `
            <div id="patientDetails1-${uniqueId}" class="patientDetails" style="position: absolute; top: 0; left: 0;">
                <div id="patientId-${uniqueId}">Patient ID: N/A</div>
                <div id="patientName-${uniqueId}">Patient Name: N/A</div>
                <div id="patientBirth-${uniqueId}">Patient BirthDate: N/A</div>
                <div id="patientGender-${uniqueId}">Patient Gender: N/A</div>
            </div>
            <div id="patientDetails2-${uniqueId}" class="patientDetails" style="position: absolute; top: 0; right: 0;">
                <div id="studyDescription-${uniqueId}" style="text-align: right;">Study Description: N/A</div>
                <div id="studyDate-${uniqueId}" style="text-align: right;">Study Date: N/A</div>
            </div>
            <div id="patientDetails3-${uniqueId}" class="patientDetails" style="position: absolute; bottom: 0; left: 0;">
                <div id="zoom-${uniqueId}">Zoom: N/A</div>
                <div id="wwc-${uniqueId}">Wwc: N/A</div>
            </div>
            <div id="patientDetails4-${uniqueId}" class="patientDetails" style="position: absolute; bottom: 0; right: 0;">
                <div id="width-${uniqueId}" style="text-align: right;">Width: N/A</div>
                <div id="length-${uniqueId}" style="text-align: right;">Length: N/A</div>
            </div>
        `;
            dicomViewerContainer.appendChild(div);
            div.addEventListener('click', function () {
                // Deselect the previously selected canvas (if any)
                const selectedCanvas = document.querySelector('.selected');
                if (selectedCanvas) {
                    selectedCanvas.classList.remove('selected');
                    selectedCanvas.style.border = '1px solid white';  // Reset border color
                }
                // Select the clicked canvas
                this.classList.add('selected');
                this.style.border = '2px solid red';  // Change border color to red
            });
        }
    }

    // Load previously stored images into the new canvases if available
    console.log({ storedImages });
    let canvasIndex = 0;
    for (const [canvasId, imageId] of Object.entries(storedImages)) {
        if (canvasIndex < newCanvasIds.length) {
            const tCanvas = document.getElementById(newCanvasIds[canvasIndex]);
            cornerstone.enable(tCanvas);
            loadImage(imageId, tCanvas);
            canvasIndex++;
        } else {
            delete storedImages[canvasId];  // Clear the stored image for this canvas
        }
    }
}

// Set default layout to 1x1
createCanvases('1x1');

const dicomViewerContainer = document.getElementById('dicomViewerContainer');
dicomViewerContainer.addEventListener('dragover', handleDragOver);
dicomViewerContainer.addEventListener('drop', handleDrop);

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.getAttribute('data-url'));
}

function handleDragOver(event) {
    event.preventDefault();
}

function loadImage(imageId, element) {
    cornerstoneTools.stopClip(element);
    const fileName = imageId.split('/').pop();
    const extension = fileName.split('.').pop().toLowerCase();
    // Load and display the image in the target canvas
    cornerstone.loadImage(imageId).then(function (image) {
        const imageData = image.data; // Retrieve the image data

        if (extension === 'dcm') {
            const dataSet = image.data;
            const numFrames = dataSet.string('x00280008')
            const FrameRate = 1000 / dataSet.floatString('x00181063');
            if (imageData) {
                console.log('numFrames:', numFrames);
                const imageIds = [];
                for (var i = 0; i < numFrames; i++) {
                    const imageIdR = imageId + "?frame=" + i;
                    imageIds.push(imageIdR);
                }
                const stack = {
                    currentImageIdIndex: 0,
                    imageIds: imageIds
                };
                console.log({ imageId })
                if (numFrames > 1) {
                    cornerstone.loadAndCacheImage(imageIds[0]).then(function (image) {
                        cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(imageId);

                        cornerstone.displayImage(element, image);
                        cornerstone.reset(element);

                        cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
                        cornerstoneTools.addToolState(element, 'stack', stack);


                        loaded = true;
                    }, function (err) {
                        alert(err);
                    });
                } else {
                    cornerstone.displayImage(element, image);
                    cornerstone.reset(element);
                }
            } else {
                cornerstone.displayImage(element, image);
                cornerstone.reset(element);
            }

            const defaultViewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.setViewport(element, defaultViewport);

            // Extract and display DICOM metadata
            const uniqueId = element.id;
            // Example: update patient details in the canvas div
            document.getElementById(`patientId-${uniqueId}`).textContent = `${dataSet.string('x00100020') || 'N/A'}`;
            document.getElementById(`patientName-${uniqueId}`).textContent = `Patient Name: ${dataSet.string('x00100010') || 'N/A'}`;
            document.getElementById(`patientGender-${uniqueId}`).textContent = `Patient Gender: ${dataSet.string('x00100040') || 'N/A'}`;
            document.getElementById(`patientBirth-${uniqueId}`).textContent = `Patient BirthDate: ${dataSet.string('x00100030') || 'N/A'}`;
            document.getElementById(`studyDescription-${uniqueId}`).textContent = `${dataSet.string('x0008103e') || 'N/A'}`;
            document.getElementById(`studyDate-${uniqueId}`).textContent = `Study Date: ${dataSet.string('x00080020') || 'N/A'}`;
            document.getElementById(`width-${uniqueId}`).textContent = `Width: ${dataSet.uint16('x00280010') || 'N/A'}`;
            document.getElementById(`length-${uniqueId}`).textContent = `Length: ${dataSet.uint16('x00280011') || 'N/A'}`;
            // Add more metadata as needed
        } else {
            // Reset viewport and clear details for non-DICOM files
            const defaultWebViewport = {
                invert: false,
                voi: {
                    windowWidth: 255,
                    windowCenter: 128
                }
            };
            cornerstone.setViewport(element, defaultWebViewport);
            cornerstone.displayImage(element, image);
            cornerstone.reset(element);
        }

        element.addEventListener('cornerstoneimagerendered', function (e) {
            const viewport = cornerstone.getViewport(e.target);
            const zoom = viewport.scale.toFixed(2);
            const wwc = `W: ${viewport.voi.windowWidth.toFixed(2)}, L: ${viewport.voi.windowCenter.toFixed(2)}`;
    
            const uniqueId = e.target.id;
            document.getElementById(`zoom-${uniqueId}`).textContent = `Zoom: ${zoom}`;
            document.getElementById(`wwc-${uniqueId}`).textContent = `Wwc: ${wwc}`;
        });
    
    }).catch(function (err) {
        console.error('Error loading image:', err);
    });
}
function handleDrop(event) {
    event.preventDefault();
    const targetCanvas = event.target.closest('.dicomViewer');  // Get the canvas where the file is dropped
    console.log('Dropped on canvas:', targetCanvas);
    cornerstone.enable(targetCanvas);  // Ensure the canvas is enabled

    console.log('event data', event.dataTransfer)
    // Get the dropped file URL
    const url = event.dataTransfer.getData('text/uri-list');
    console.log({ url });
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop().toLowerCase();

    let imageId;
    console.log('extension:', extension);
    // Use different imageId formats based on the file type
    if (extension === 'dcm') {
        imageId = 'wadouri:' + url;  // Use wadouri for DICOM
    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
        console.log('url:', url);
        const baseUrl = "http://localhost:5000";
        const pathname = new URL(url).pathname;
        imageId = baseUrl + pathname;
        console.log('imageId: ', imageId || undefined);
    } else {
        console.error('Unsupported file format:', extension);
        return;
    }

    // Store the image in the global variable for persistence across layouts
    storedImages[targetCanvas.id] = imageId;
    loadImage(imageId, targetCanvas);

    // 

    targetCanvas.addEventListener('cornerstoneimagerendered', function (e) {
        const viewport = cornerstone.getViewport(e.target);
        const zoom = viewport.scale.toFixed(2);
        const wwc = `W: ${viewport.voi.windowWidth.toFixed(2)}, L: ${viewport.voi.windowCenter.toFixed(2)}`;

        const uniqueId = e.target.id;
        document.getElementById(`zoom-${uniqueId}`).textContent = `Zoom: ${zoom}`;
        document.getElementById(`wwc-${uniqueId}`).textContent = `Wwc: ${wwc}`;
    });

}

window.onload = function () {
    const draggableDivs = document.querySelectorAll('#previewList .draggable');

    draggableDivs.forEach(function (draggableDiv) {
        const url = 'http://127.0.0.1:5000' + draggableDiv.dataset.url;

        draggableDiv.setAttribute = 'draggable'
        // Set up drag event
        draggableDiv.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/uri-list', url);
            e.dataTransfer.setData('text/plain', draggableDiv.innerText);
            console.log('Dragging:', url);
        });

    });

    const targetCanvas = document.querySelector('.dicomViewer'); // Adjust selector as needed

    targetCanvas.addEventListener('dragover', handleDragOver);
    targetCanvas.addEventListener('drop', handleDrop);
};

document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.date-dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function () {
            const gallery = this.nextElementSibling;
            gallery.style.display = (gallery.style.display === 'none' || gallery.style.display === '') ? 'flex' : 'none';
            this.classList.toggle('open'); // Toggle open class to rotate the arrow
        });
    });
});

function renderImagesOnCanvases(selectedImages, layout) {
    const [rows, cols] = layout.split('x').map(Number);
    let imageIndex = 0;  // Track the index of the current image to be rendered

    // Loop through each cell in the layout and render the corresponding image
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (imageIndex >= selectedImages.length) return;  // Exit if all images are rendered

            const uniqueId = `canvas-${i}-${j}`;
            const targetCanvas = document.getElementById(uniqueId);

            // Enable cornerstone for this canvas
            cornerstone.enable(targetCanvas);

            // Get the URL and determine the imageId based on file type
            const url = selectedImages[imageIndex];
            console.log({ url });
            const fileName = url.split('/').pop();
            const extension = fileName.split('.').pop().toLowerCase();


            let imageId;
            console.log('extension:', extension);
            // Use different imageId formats based on the file type
            if (extension === 'dcm') {
                imageId = 'wadouri:' + url;  // Use wadouri for DICOM
            } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
                console.log('url:', url);
                const baseUrl = "http://localhost:5000";
                // const pathname = new URL(url).pathname;
                imageId = baseUrl + url;
                console.log('imageId: ', imageId || undefined);
            } else {
                console.error('Unsupported file format:', extension);
                continue;
            }
            loadImage(imageId, targetCanvas);

            // Store the image in the global variable for persistence across layouts
            storedImages[targetCanvas.id] = imageId;
            // Attach tool activation for the new canvas
            cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
            cornerstoneTools.setToolActiveForElement(targetCanvas, 'StackScrollMouseWheel', { mouseButtonMask: 1 });

            // Set up playClip for cine mode
            cornerstoneTools.setToolActiveForElement(targetCanvas, 'playClip', { frameRate: 30 });

            imageIndex++;  // Move to the next image
        }
    }
}

function findBestLayout(numImages) {
    const layouts = {
        1: '1x1',
        2: '1x2',
        3: '1x3',
        4: '2x2',
        5: '2x3',
        6: '2x3',
        7: '3x3',
        8: '3x3',
        9: '3x3'
    };

    // Return the layout based on the number of images, or default to '3x3'
    return layouts[numImages] || '3x3';
}

document.getElementById("openButton").addEventListener("click", function () {
    // Array to hold the selected image URLs
    let selectedImages = [];

    // Get all the checkboxes
    const checkboxes = document.querySelectorAll(".image-checkbox");

    // Loop through the checkboxes and check if they are selected
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            // Get the URL from the data-url attribute of the parent div (previewSquare)
            const imageUrl = checkbox.closest(".previewSquare").getAttribute("data-url");
            // Add the image URL to the array
            selectedImages.push(imageUrl);
        }
    });

    // Log the selected images URLs
    console.log("Selected Images:", selectedImages);

    const layout = findBestLayout(selectedImages.length);
    console.log("Best Layout:", layout);

    storedImages = {};
    createCanvases(layout);

    renderImagesOnCanvases(selectedImages, layout);

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
});


// function activateReferenceLinesAndCrosshairs() {
//     const rows = 1;
//     const cols = 2;
//     cornerstoneTools.init();

//     // Add the necessary tools to the tool manager
//     cornerstoneTools.addTool(cornerstoneTools.CrosshairsTool);
//     cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);

//     // Get all canvas elements and enable cornerstone for each
//     let canvases = [];
//     for (let i = 0; i < rows; i++) {
//         for (let j = 0; j < cols; j++) {
//             const uniqueId = `canvas-${i}-${j}`;
//             const targetCanvas = document.getElementById(uniqueId);
//             canvases.push(targetCanvas);
//             cornerstone.enable(targetCanvas);
//         }
//     }

//     if (canvases.length < 2) {
//         console.error("Expected two canvases for 1x2 layout.");
//         return;
//     }

//     const [canvas1, canvas2] = canvases;

//     // Set Crosshairs and Reference Lines active for each canvas
//     cornerstoneTools.setToolActiveForElement(canvas1, 'Crosshairs', { mouseButtonMask: 1 });
//     cornerstoneTools.setToolActiveForElement(canvas2, 'Crosshairs', { mouseButtonMask: 1 });

//     cornerstoneTools.setToolEnabledForElement(canvas1, 'ReferenceLines', {
//         targetElements: [canvas2]
//     });
//     cornerstoneTools.setToolEnabledForElement(canvas2, 'ReferenceLines', {
//         targetElements: [canvas1]
//     });

//     // Attach crosshair synchronization logic
//     synchronizeCrosshairs(canvas1, canvas2);
// }

// // Function to synchronize crosshairs between two canvases
// function synchronizeCrosshairs(canvas1, canvas2) {
//     // Define a shared crosshair synchronization function
//     const syncCrosshair = (event) => {
//         const element = event.detail.element;
//         const enabledElement = cornerstone.getEnabledElement(element);

//         if (!enabledElement || !enabledElement.image) return;

//         // Get the current crosshair coordinates in the middle of the image
//         const coords = {
//             x: enabledElement.image.width / 2,
//             y: enabledElement.image.height / 2,
//         };

//         const otherCanvas = element === canvas1 ? canvas2 : canvas1;

//         // Retrieve the tool state for the crosshairs tool on the target element
//         const toolState = cornerstoneTools.getToolState(element, 'Crosshairs');
//         if (toolState && toolState.data) {
//             // Update the crosshair handles on the other canvas
//             toolState.data.forEach((toolData) => {
//                 if (toolData.handles && toolData.handles.start && toolData.handles.end) {
//                     toolData.handles.start.x = coords.x;
//                     toolData.handles.start.y = coords.y;
//                     toolData.handles.end.x = coords.x + 1; // A slight offset to show the crosshair line
//                     toolData.handles.end.y = coords.y + 1;

//                     // Trigger a redraw on the other canvas
//                     cornerstone.updateImage(otherCanvas);
//                 } else {
//                     console.warn("Crosshair handles are not properly initialized.");
//                 }
//             });
//         } else {
//             console.warn("Crosshair tool state is not defined for this element.");
//         }
//     };

//     // Attach the event listeners to synchronize crosshairs
//     canvas1.addEventListener('cornerstoneimagerendered', syncCrosshair);
//     canvas2.addEventListener('cornerstoneimagerendered', syncCrosshair);
// }


function activateCrosshairs() {
    const rows = 1;
    const cols = 2;
    cornerstoneTools.init();

    for(var i= 0; i < rows; i++) {
        for(var j = 0; j < cols; j++) {
            const uniqueId = `canvas-${i}-${j}`;
            const targetCanvas = document.getElementById(uniqueId);
            cornerstone.enable(targetCanvas);
            
            
        }
    }
}