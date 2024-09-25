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
         overlayDiv.style.position = 'absolute';
         overlayDiv.style.top = '0'; // Aligns with top of the canvas
         overlayDiv.style.left = '0'; // Aligns with left of the canvas
         overlayDiv.style.width = element.offsetWidth+10 + 'px';
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

    console.log('cornerstoneTools', cornerstoneTools);
    // Initialize Cornerstone Tools
    cornerstoneTools.addTool(cornerstoneTools.WwwcTool);  // Window/Level tool
    cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });  // Default to Window/Level


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

    document.getElementById('activateCrosshair').addEventListener('click', function (e) {
        console.log("Crosshair tool activated");
        cornerstoneTools.addTool(cornerstoneTools.CrosshairsTool);
        cornerstoneTools.setToolActive('Crosshairs', { mouseButtonMask: 1 })
        console.log('Active Tools:', cornerstoneTools.getActiveTools);
    });


    document.getElementById('activateErase').addEventListener('click', function (e) {
        console.log("Erase tool activated");
        cornerstoneTools.addTool(cornerstoneTools.EraserTool)
        cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 })
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
        if (button.id !== 'moreButton' && button.id !== 'addFile' && button.id !== 'resetTools' && button.id !== 'layout' && button.id !== 'lRotate' && button.id !== 'rRotate' && button.id !== 'hFlip' && button.id !== 'vFlip' && button.id !== 'activateInvert') {
            button.classList.add('active'); // Add active class first
            document.querySelectorAll('.icon-button').forEach(btn => {
                if (btn !== button) { // Only remove active from other buttons
                    btn.classList.remove('active');
                }
            });
        }
    });
});

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

    // Load and display the image in the target canvas
    cornerstone.loadImage(imageId).then(function (image) {
        const imageData = image.data; // Retrieve the image data

        // Check if imageData is valid and contains the necessary metadata

        //   console.log('Image data:', imageData.string('x00280008'));


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
                console.log({imageId})
                if(numFrames > 1 && numFrames !== undefined){
                cornerstone.loadAndCacheImage(imageIds[0]).then(function (image) {
                    // console.log(image);
                    // now that we have an image frame in the cornerstone cache, we can decrement
                    // the reference count added by load() above when we loaded the metadata.  This way
                    // cornerstone will free all memory once all imageId's are removed from the cache
                    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(imageId);

                    cornerstone.displayImage(targetCanvas, image);
                    // if(loaded === false) {
                    // cornerstoneTools.wwwc.activate(targetCanvas, 1); // ww/wc is the default tool for left mouse button
                    // const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool;

                    // cornerstoneTools.addTool(ScaleOverlayTool)
                    // cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 1 })
                    // Set the stack as tool state
                    cornerstoneTools.addStackStateManager(targetCanvas, ['stack', 'playClip']);
                    cornerstoneTools.addToolState(targetCanvas, 'stack', stack);


                    loaded = true;
                }, function (err) {
                    alert(err);
                });
                } else {
                    cornerstone.displayImage(targetCanvas, image);
                }
            } else {
                cornerstone.displayImage(targetCanvas, image);
            }

            const defaultViewport = cornerstone.getDefaultViewportForImage(targetCanvas, image);
            cornerstone.setViewport(targetCanvas, defaultViewport);

            // Extract and display DICOM metadata
            const uniqueId = targetCanvas.id;
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
            cornerstone.setViewport(targetCanvas, defaultWebViewport);
            cornerstone.displayImage(targetCanvas, image);
        }
    }).catch(function (err) {
        console.error('Error loading image:', err);
    });

    cornerstoneTools.stopClip(targetCanvas);

    targetCanvas.addEventListener('cornerstoneimagerendered', function (e) {
        const viewport = cornerstone.getViewport(e.target);
        const zoom = viewport.scale.toFixed(2);
        const wwc = `W: ${viewport.voi.windowWidth.toFixed(2)}, L: ${viewport.voi.windowCenter.toFixed(2)}`;

        const uniqueId = e.target.id;
        document.getElementById(`zoom-${uniqueId}`).textContent = `Zoom: ${zoom}`;
        document.getElementById(`wwc-${uniqueId}`).textContent = `Wwc: ${wwc}`;
    });

    document.getElementById('resetTools').addEventListener('click', function () {
        const selectedCanvas = document.querySelector('.selected');
        if (selectedCanvas) {
            cornerstone.reset(selectedCanvas);
        } else {
            alert('Please select a canvas first.');
        }
    });

    document.getElementById('lRotate').addEventListener('click', function (e) {
        console.log({ lRotata: 'lrotate clicked' });
        const selectedCanvas = document.querySelector('.selected');
        console.log({ selectedCanvas });
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.rotation -= 90;
        cornerstone.setViewport(selectedCanvas, viewport);
    });

    document.getElementById('rRotate').addEventListener('click', function (e) {
        console.log({ rRotata: 'rrotate clicked' });
        const selectedCanvas = document.querySelector('.selected');
        console.log({ selectedCanvas });
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.rotation += 90;
        cornerstone.setViewport(selectedCanvas, viewport);
    });

    document.getElementById('hFlip').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        console.log({ selectedCanvas });
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.hflip = !viewport.hflip;
        cornerstone.setViewport(selectedCanvas, viewport);
    });

    document.getElementById('vFlip').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.vflip = !viewport.vflip;
        cornerstone.setViewport(selectedCanvas, viewport);
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

    document.getElementById('activateCine').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        cornerstoneTools.playClip(selectedCanvas, 15);
        console.log('Active Tools:', cornerstoneTools.getActiveTools);
    });

    document.getElementById('activateInvert').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(selectedCanvas, viewport);
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

function loadAndViewImage(targetElement, imageUrl) {
    const extension = imageUrl.split('.').pop().toLowerCase();
    let imageId;

    // Use different imageId formats based on the file type
    if (extension === 'dcm') {
        imageId = 'wadouri:' + imageUrl;  // Use wadouri for DICOM
    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
        imageId = imageUrl; // Use webimage for PNG, JPG
    } else {
        console.error('Unsupported file format:', extension);
        return;
    }

    console.log("ImageId:", imageId);
    cornerstone.loadImage(imageId).then(function (image) {
        console.log("Image loaded successfully:", image);
        targetElement.draggable = true;
        // Display the image on the canvas
        cornerstone.displayImage(targetElement, image);
        const defaultViewport = cornerstone.getDefaultViewportForImage(targetElement, image);
        cornerstone.setViewport(targetElement, defaultViewport);
    }).catch(function (err) {
        console.error('Error loading image:', err);
    });
}

// window.addEventListener('load', function () {

//     // Fetch all the preview elements
//     const previewElements = document.querySelectorAll('[id^="preview-"]');
//     console.log("Preview Elements:", previewElements);

//     // Iterate over the preview elements
//     previewElements.forEach((element) => {
//         const parentDiv = element.parentElement;
//         const dataUrl = parentDiv.getAttribute('data-url');
//         console.log("File URL:", dataUrl);
//         const filename = dataUrl.split('/').pop();
//         const extension = filename.split('.').pop().toLowerCase();

//         if (extension === 'dcm') {
//             fetchDcmAndRender(dataUrl, element);
//         } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
//             // Handle regular image preview
//             const imgElement = document.createElement('img');
//             imgElement.src = dataUrl;
//             imgElement.style.width = '100%';
//             imgElement.style.height = '100%';
//             element.appendChild(imgElement);
//         } else {
//             console.error('Unsupported file format:', extension);
//         }
//     });

//     function fetchDcmAndRender(dataUrl, element) {
//         fetch(dataUrl)
//             .then(response => response.arrayBuffer())
//             .then(buffer => {
//                 const byteArray = new Uint8Array(buffer);
//                 const dataSet = dicomParser.parseDicom(byteArray);
//                 const pixelDataElement = dataSet.elements.x7fe00010;

//                 if (pixelDataElement) {
//                     const pixelData = new Uint16Array(
//                         dataSet.byteArray.buffer,
//                         pixelDataElement.dataOffset,
//                         pixelDataElement.length / 2
//                     );
//                     const rows = dataSet.uint16('x00280010');
//                     const cols = dataSet.uint16('x00280011');
//                     const bitsAllocated = dataSet.uint16('x00280100');

//                     // Render the image
//                     renderToCanvas(pixelData, rows, cols, bitsAllocated, element, dataSet);
//                 } else {
//                     console.error('No pixel data found in the DICOM file.');
//                 }
//             })
//             .catch(error => console.error('Error fetching or parsing DICOM file:', error));
//     }

//     function renderToCanvas(pixelData, rows, cols, bitsAllocated, element, windowCenter = 40, windowWidth = 80, dataSet) {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         canvas.width = cols;
//         canvas.height = rows;

//         const imageData = ctx.createImageData(cols, rows);

//         // Apply windowing based on Rescale Slope and Intercept (if available)
//         const rescaleSlope = dataSet.float32('x00280102') || 1.0;
//         const rescaleIntercept = dataSet.float32('x00280100') || 0.0;

//         // Normalize pixel values to the range of 0-255
//         for (let i = 0; i < pixelData.length; i++) {
//             const pixelValue = pixelData[i];
//             // Apply rescaling
//             const windowedPixelValue = (pixelValue * rescaleSlope) + rescaleIntercept;

//             // Check if windowedPixelValue falls within the window range
//             if (windowedPixelValue < windowCenter - windowWidth / 2) {
//                 windowedPixelValue = windowCenter - windowWidth / 2;
//             } else if (windowedPixelValue > windowCenter + windowWidth / 2) {
//                 windowedPixelValue = windowCenter + windowWidth / 2;
//             }

//             // Normalize the windowed pixel value to 0-255
//             const normalizedValue = Math.round((windowedPixelValue / 255) * 255);

//             const idx = i * 4;
//             imageData.data[idx] = normalizedValue; // Red channel
//             imageData.data[idx + 1] = normalizedValue; // Green channel
//             imageData.data[idx + 2] = normalizedValue; // Blue channel
//             imageData.data[idx + 3] = 255; // Alpha channel (fully opaque)
//         }

//         ctx.putImageData(imageData, 0, 0);

//         // Convert canvas to PNG for preview
//         const pngDataUrl = canvas.toDataURL('image/png');
//         const imgElement = document.createElement('img');
//         imgElement.src = pngDataUrl;
//         imgElement.style.width = '100%';
//         imgElement.style.height = '100%';

//         // Append the PNG preview to the element
//         element.appendChild(imgElement);
//     }
// });


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
