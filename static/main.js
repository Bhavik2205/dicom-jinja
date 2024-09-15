document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded event triggered");

    // Initialize Cornerstone
    // const element = document.getElementById('dicomViewer');
    // console.log(element)
    // cornerstone.enable(element);

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
    // document.getElementById('activateBidirectional').addEventListener('click', function (e) {
    //     console.log("Bidirectional tool activated");
    //     console.log(cornerstoneTools.BidirectionalTool);
    //     cornerstoneTools.addTool(cornerstoneTools.BidirectionalTool)
    //     cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 1 })
    // });

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




   

    // File input element
    // const fileInput = document.getElementById('file');
    // console.log('fileInput', fileInput);
    // if (fileInput) {
    //     // Event listener for file selection
    //     fileInput.addEventListener('change', function (event) {
    //         console.log("File input changed");
    //         const file = event.target.files[0];
    //         if (file) {
    //             const reader = new FileReader();
    //             reader.onload = function (e) {
    //                 console.log("File read as ArrayBuffer");
    //                 const arrayBuffer = e.target.result;
    //                 const byteArray = new Uint8Array(arrayBuffer);

    //                 // Parse DICOM file
    //                 dicomParser.parseDicom(byteArray).then(function (dataSet) {
    //                     console.log("DICOM file parsed");
    //                     const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(dataSet);
    //                     cornerstone.loadImage(imageId).then(function (image) {
    //                         console.log("Image loaded");
    //                         cornerstone.displayImage(element, image);
    //                     }).catch(function (err) {
    //                         console.error('Error loading image:', err);
    //                     });
    //                 }).catch(function (err) {
    //                     console.error('Error parsing DICOM file:', err);
    //                 });
    //             };
    //             reader.readAsArrayBuffer(file);
    //         }
    //     });
    // }

    // Add event listener for image rendered event
    // element.addEventListener('cornerstoneimagerendered', function (e) {
    //     const viewport = cornerstone.getViewport(e.target);
    //     const zoom = viewport.scale.toFixed(2);
    //     const wwc = `W: ${viewport.voi.windowWidth.toFixed(2)}, L: ${viewport.voi.windowCenter.toFixed(2)}`;

    //     document.getElementById('zoom').textContent = `Zoom: ${zoom}`;
    //     document.getElementById('wwc').textContent = `Wwc: ${wwc}`;
    // });


    // function loadAndViewImage(linkElement, fileName) {
    //     const imageUrl = linkElement.getAttribute('data-url');
    //     console.log("Loading image:", imageUrl);
    //     const extension = fileName.split('.').pop().toLowerCase();

    //     let imageId;

    //     cornerstone.reset(element);

    //     // Use different imageId formats based on the file type
    //     if (extension === 'dcm') {
    //         imageId = 'wadouri:' + imageUrl;  // Use wadouri for DICOM
    //     } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
    //         imageId = "http://localhost:5000" + imageUrl; // Use webimage for PNG, JPG
    //     } else {
    //         console.error('Unsupported file format:', extension);
    //         return;
    //     }

    //     console.log("ImageId:", imageId);
    //     cornerstone.loadImage(imageId).then(function (image) {
    //         console.log("Image loaded successfully:", image);
    //         // const firstCanvas = document.querySelector('#dicomViewerContainer .dicomViewer');
    //         // if (firstCanvas) {
    //         //     cornerstone.displayImage(firstCanvas, image);
    //         // } else {
    //         cornerstone.displayImage(element, image);
    //         // }


    //         if (extension === 'dcm') {
    //             const defaultViewport = cornerstone.getDefaultViewportForImage(element, image);
    //             cornerstone.setViewport(element, defaultViewport);
    //             // Extract and display DICOM metadata only for DICOM files
    //             const dataSet = image.data;
    //             displayDICOMDetails(dataSet);
    //         } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
    //             // Reset viewport for web images (e.g., JPG/PNG)
    //             const defaultWebViewport = {
    //                 invert: false,  // Ensure the image isn't inverted
    //                 voi: {
    //                     windowWidth: 255,  // Standard window width for web images
    //                     windowCenter: 128  // Standard window center for web images
    //                 }
    //             };
    //             cornerstone.setViewport(element, defaultWebViewport);

    //             // Clear DICOM details for non-DICOM files
    //             document.getElementById('detailsList').innerHTML = '';

    //             document.getElementById('patientId').textContent = 'Patient ID: N/A';
    //             document.getElementById('patientName').textContent = 'Patient Name: N/A';
    //             document.getElementById('patientGender').textContent = 'Patient BirthDate: N/A';
    //             document.getElementById('patientBirth').textContent = 'Patient Gender: N/A';
    //             document.getElementById('studyDescription').textContent = 'Study Description: N/A';
    //             document.getElementById('studyDate').textContent = 'Study Date: N/A';
    //         }
    //     }).catch(function (err) {
    //         console.error('Error loading image:', err);
    //     });
    // }

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

    // Get the dropped file URL
    console.log('event:', event);
    const url = event.dataTransfer.getData('text/uri-list');
    console.log('Dropped URL:', url);
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop().toLowerCase();
    console.log('Dropped file:', fileName);
    console.log('Extension:', extension);
    let imageId;

    // Use different imageId formats based on the file type
    if (extension === 'dcm') {
        imageId = 'wadouri:' + url;  // Use wadouri for DICOM
    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
        console.log('url:', url);
        const baseUrl = "http://localhost:5000";
        const pathname = new URL(url).pathname;
        imageId = baseUrl + pathname;
        console.log('imageId: ', imageId);
    } else {
        console.error('Unsupported file format:', extension);
        return;
    }

    // Load and display the image in the target canvas
    cornerstone.loadImage(imageId).then(function (image) {
        cornerstone.displayImage(targetCanvas, image);

        if (extension === 'dcm') {
            const defaultViewport = cornerstone.getDefaultViewportForImage(targetCanvas, image);
            cornerstone.setViewport(targetCanvas, defaultViewport);

            // Extract and display DICOM metadata
            const dataSet = image.data;
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
        }
    }).catch(function (err) {
        console.error('Error loading image:', err);
    });
    
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
        const selectedCanvas = document.querySelector('.selected');
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.rotation -= 90;
        cornerstone.setViewport(selectedCanvas, viewport);
    });

    document.getElementById('rRotate').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.rotation += 90;
        cornerstone.setViewport(selectedCanvas, viewport);
    });

    document.getElementById('hFlip').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
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
    
    document.getElementById('activateInvert').addEventListener('click', function (e) {
        const selectedCanvas = document.querySelector('.selected');
        const viewport = cornerstone.getViewport(selectedCanvas);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(selectedCanvas, viewport);
    });
}

function loadAndViewImage(linkElement, fileName) {
    const imageUrl = linkElement.getAttribute('data-url');
    console.log("Loading image:", imageUrl);
    const extension = fileName.split('.').pop().toLowerCase();

    let imageId;

    cornerstone.reset(linkElement);

    // Use different imageId formats based on the file type
    if (extension === 'dcm') {
        imageId = 'wadouri:' + imageUrl;  // Use wadouri for DICOM
    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
        imageId = "http://localhost:5000" + imageUrl; // Use webimage for PNG, JPG
    } else {
        console.error('Unsupported file format:', extension);
        return;
    }

    console.log("ImageId:", imageId);
    cornerstone.loadImage(imageId).then(function (image) {
        console.log("Image loaded successfully:", image);
        
        cornerstone.displayImage(linkElement, image);


        if (extension === 'dcm') {
            const defaultViewport = cornerstone.getDefaultViewportForImage(linkElement, image);
            cornerstone.setViewport(linkElement, defaultViewport);
            // Extract and display DICOM metadata only for DICOM files
            const dataSet = image.data;
        } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
            // Reset viewport for web images (e.g., JPG/PNG)
            const defaultWebViewport = {
                invert: false,  // Ensure the image isn't inverted
                voi: {
                    windowWidth: 255,  // Standard window width for web images
                    windowCenter: 128  // Standard window center for web images
                }
            };
            cornerstone.setViewport(linkElement, defaultWebViewport);
        }
    }).catch(function (err) {
        console.error('Error loading image:', err);
    });
}


window.addEventListener('load', function () {
    const fileLinks = document.querySelectorAll('#previewList .file-preview');
    fileLinks.forEach(function (linkElement) {
        const fileName = linkElement.getAttribute('data-filename');
        console.log("File Name:", fileName);
        cornerstone.enable(linkElement);
        console.log('fileName:', fileName);
        loadAndViewImage(linkElement, fileName);

        const container = linkElement.closest('div[draggable="true"]');
        console.log("Container:", container);
        // Handle the drag on the parent container
        container.addEventListener('dragstart', function (event) {
            console.log('data-url: ', linkElement.getAttribute('data-url'));
            event.dataTransfer.setData('text/uri-list', linkElement.getAttribute('data-url'));
            event.dataTransfer.setData('text/plain', fileName);
            console.log('Dragging:', fileName);
        });
    });
});

// window.addEventListener('load', function () {
//     const filePreviews = document.querySelectorAll('#previewList a ');

//     console.log("File Previews:", filePreviews);
    
//     // Enable each preview element for Cornerstone and make it draggable
//     filePreviews.forEach(function (previewElement) {
//         console.log('previewElement: ', previewElement);
//         const element = previewElement.getElementsByClassName('.preview');
//         console.log('element: ', element);
//         const fileName = previewElement.getAttribute('data-filename');
//         const imageUrl = previewElement.getAttribute('data-url');
        
//         // Enable dragging for the preview element
//         previewElement.addEventListener('dragstart', function (event) {
//             // Set data to transfer (can include the file URL or filename)
//             event.dataTransfer.setData('text/plain', fileName);
//             console.log("Dragging file:", fileName);
//         });

//         // Enable Cornerstone for the preview element
//         cornerstone.enable(previewElement);

//         // Automatically load and view the image on page load
//         loadAndViewImage(previewElement, fileName);
//     });
// });

// Ensure that your existing loadAndViewImage function is used here to load files correctly
