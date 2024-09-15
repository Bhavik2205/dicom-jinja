<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DICOM Viewer</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <!------ Cornerstone tools ------->
    <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
    <script src="https://cdn.jsdelivr.net/npm/cornerstone-math@0.1.6/dist/cornerstoneMath.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/cornerstone-core@2.2.4/dist/cornerstone.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-web-image-loader@2.1.0/dist/cornerstoneWebImageLoader.js"></script>

    <!-- development version, includes helpful console warnings -->
    <script src="https://cdn.jsdelivr.net/npm/cornerstone-tools@3.0.0-b.641/dist/cornerstoneTools.js"></script>
    <!-- Load Cornerstone libraries -->
    <script src="https://unpkg.com/dicom-parser@latest/dist/dicomParser.min.js"></script>
    <script src="https://unpkg.com/cornerstone-core/dist/cornerstone.min.js"></script>
    <script src="https://unpkg.com/cornerstone-tools/dist/cornerstoneTools.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoader.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-web-image-loader@2.1.1/dist/cornerstoneWebImageLoader.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-file-image-loader@0.3.0/dist/cornerstoneFileImageLoader.min.js"></script>
</head>

<body>
    <header>
        <img src="{{ url_for('static', filename='logoFull.png') }}" alt="Company Logo" class="logo">
        <div class="button-container">
            <button id="activateWwwc">Window / Level</button>
            <button id="activateInvert">Invert</button>
            <button id="activateRectangle">Rectangle Roi</button>
        <button id="activateCircle">Circle Roi</button>
        <button id="activateElliptical">Elliptical Roi</button>
        <button id="activateArrowAnnotate">Arrow Annotate</button>
        <button id="activatePan">Pan</button>
        <button id="activateZoom">Zoom</button>
        <button id="activateMagnify">Magnify</button>
        <button id="activateRotate">Rotate</button>
        <button id="hFlip" type="button" class="btn btn-default">HFlip</button>
        <button id="vFlip" type="button" class="btn btn-default">VFlip</button>
        <button id="lRotate" type="button" class="btn btn-default">Rotate Left</button>
        <button id="rRotate" type="button" class="btn btn-default">Rotate Right</button>
        <button id="activateLength">Length</button>
        <!-- <button id="activateBidirectional">Bidirectional</button> -->
        <button id="activateAngle">Angle</button>
        <button id="activateCobbAngle">Cobb Angle</button>
        <button id="activateErase">Erase</button>
        <button id="resetTools">Reset Tools</button>
        </div>
    </header>
    <h1>Upload and View DICOM Files</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" id="file" name="file" accept=".dcm, .jpg, .png">
        <input type="submit" value="Upload">
    </form>

    <h2>Uploaded Files:</h2>
    <ul id="fileList">
        {% for file in files %}
        <li>
            <a draggable="true" data-url="{{ url_for('uploaded_file', filename=file) }}"
                onclick="loadAndViewImage(this, '{{ file }}'); return false;">{{ file }}</a>
        </li>
        {% endfor %}
    </ul>

    <h2>DICOM Viewer</h2>
    <!-- <div id="toolbar">
        <button id="activateWwwc">Window / Level</button>
        <button class="dropbtn">Select Layout:<select id="layoutSelect">
                <option value="1x1">1x1</option>
                <option value="1x2">1x2</option>
                <option value="1x3">1x3</option>
                <option value="2x1">2x1</option>
                <option value="2x2">2x2</option>
                <option value="2x3">2x3</option>
                <option value="3x1">3x1</option>
                <option value="3x2">3x2</option>
                <option value="3x3">3x3</option>
            </select></button>
        <button id="activateInvert">Invert</button>
        <button id="activateRectangle">Rectangle Roi</button>
        <button id="activateCircle">Circle Roi</button>
        <button id="activateElliptical">Elliptical Roi</button>
        <button id="activateArrowAnnotate">Arrow Annotate</button>
        <button id="activatePan">Pan</button>
        <button id="activateZoom">Zoom</button>
        <button id="activateMagnify">Magnify</button>
        <button id="activateRotate">Rotate</button>
        <button id="hFlip" type="button" class="btn btn-default">HFlip</button>
        <button id="vFlip" type="button" class="btn btn-default">VFlip</button>
        <button id="lRotate" type="button" class="btn btn-default">Rotate Left</button>
        <button id="rRotate" type="button" class="btn btn-default">Rotate Right</button>
        <button id="activateLength">Length</button>
        <button id="activateBidirectional">Bidirectional</button> -->
        <!-- <button id="activateAngle">Angle</button>
        <button id="activateCobbAngle">Cobb Angle</button>
        <button id="activateErase">Erase</button>
        <button id="resetTools">Reset Tools</button>
    </div> -->
    <div id="block">
        <!-- <div id="dicomViewerContainer"> -->
        <!-- Canvases will be dynamically generated here -->
        <!-- </div> -->
        <div id="dicomViewer">
            <div id="patientDetails1">
                <div id="patientId">Patient ID: N/A</div>
                <div id="patientName">Patient Name: N/A</div>
                <div id="patientBirth">Patient BirthDate: N/A</div>
                <div id="patientGender">Patient Gender: N/A</div>
            </div>
            <div id="patientDetails2">
                <div id="studyDescription">Study Description: N/A</div>
                <div id="studyDate">Study Date: N/A</div>
            </div>
            <div id="patientDetails3">
                <div id="zoom">Zoom: N/A</div>
                <div id="wwc">Wwc: N/A</div>
            </div>
            <div id="patientDetails4">
                <div id="width">Width: N/A</div>
                <div id="length">Length: N/A</div>
            </div>
        </div>
        <div id="dicomDetails">
            <h3>DICOM File Details</h3>
            <ul id="detailsList">
                <!-- DICOM metadata will be populated here -->
            </ul>
        </div>
    </div>
    </div>

    <script>
        // Initialize Cornerstone
        cornerstoneWebImageLoader.external.cornerstone = cornerstone;
        cornerstoneFileImageLoader.external.cornerstone = cornerstone
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.cornerstoneTools = cornerstoneTools;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

        cornerstoneWADOImageLoader.configure({
            useWebWorkers: true,
            webWorkerPath: "https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoaderWebWorker.min.js", // Correct path
            taskConfiguration: {
                'decodeTask': {
                    codecsPath: 'https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoaderCodecs.min.js'
                }
            }
        });

        // Register image loaders
        cornerstone.registerImageLoader('webimage', cornerstoneWebImageLoader.loadImage);
        cornerstone.registerImageLoader('file', cornerstoneFileImageLoader.loadImage);

        // Enable the viewer element
        const element = document.getElementById('dicomViewer');
        cornerstone.enable(element);

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

        function loadAndViewImage(linkElement, fileName) {
            const imageUrl = linkElement.getAttribute('data-url');
            console.log("Loading image:", imageUrl);
            const extension = fileName.split('.').pop().toLowerCase();

            let imageId;

            cornerstone.reset(element);

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
                // const firstCanvas = document.querySelector('#dicomViewerContainer .dicomViewer');
                // if (firstCanvas) {
                //     cornerstone.displayImage(firstCanvas, image);
                // } else {
                cornerstone.displayImage(element, image);
                // }


                if (extension === 'dcm') {
                    const defaultViewport = cornerstone.getDefaultViewportForImage(element, image);
                    cornerstone.setViewport(element, defaultViewport);
                    // Extract and display DICOM metadata only for DICOM files
                    const dataSet = image.data;
                    displayDICOMDetails(dataSet);
                } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
                    // Reset viewport for web images (e.g., JPG/PNG)
                    const defaultWebViewport = {
                        invert: false,  // Ensure the image isn't inverted
                        voi: {
                            windowWidth: 255,  // Standard window width for web images
                            windowCenter: 128  // Standard window center for web images
                        }
                    };
                    cornerstone.setViewport(element, defaultWebViewport);

                    // Clear DICOM details for non-DICOM files
                    document.getElementById('detailsList').innerHTML = '';

                    document.getElementById('patientId').textContent = 'Patient ID: N/A';
                    document.getElementById('patientName').textContent = 'Patient Name: N/A';
                    document.getElementById('patientGender').textContent = 'Patient BirthDate: N/A';
                    document.getElementById('patientBirth').textContent = 'Patient Gender: N/A';
                    document.getElementById('studyDescription').textContent = 'Study Description: N/A';
                    document.getElementById('studyDate').textContent = 'Study Date: N/A';
                }
            }).catch(function (err) {
                console.error('Error loading image:', err);
            });
        }


        function displayDICOMDetails(dataSet) {
            const detailsList = document.getElementById('detailsList');
            detailsList.innerHTML = '';  // Clear the list before displaying new metadata

            // Extract and display patient details
            const patientId = dataSet.string('x00100020') || 'N/A';
            const patientName = dataSet.string('x00100010') || 'N/A';
            const patientGender = dataSet.string('x00100040') || 'N/A';
            const patientBirth = dataSet.string('x00100030') || 'N/A';
            const studyDescription = dataSet.string('x0008103e') || 'N/A';
            const studyDate = dataSet.string('x00080020') || 'N/A';

            document.getElementById('patientId').textContent = `${patientId}`;
            document.getElementById('patientName').textContent = `${patientName}`;
            document.getElementById('patientGender').textContent = `${patientGender}`;
            document.getElementById('patientBirth').textContent = `${patientBirth}`;
            document.getElementById('studyDescription').textContent = `Study Description: ${studyDescription}`;
            document.getElementById('studyDate').textContent = `Study Date: ${studyDate}`;

            // // Extract image width and height
            const imageHeight = dataSet.uint16('x00280010') || 'N/A'; // Rows (Height)
            const imageWidth = dataSet.uint16('x00280011') || 'N/A';  // Columns (Width)

            document.getElementById('width').textContent = `Width: ${imageWidth}`;
            document.getElementById('length').textContent = `Length: ${imageHeight}`;

            // Define tags to extract (you can add more tags as needed)
            const tags = {
                'x00100010': 'Patient Name',
                'x00100020': 'Patient ID',
                'x00100030': 'Patient Birth Date',
                'x00100040': 'Patient Gender',
                'x00101010': 'Patient Age',
                'x00101030': 'Patient Weight',
                'x00101020': 'Patient Size',
                'x00101040': 'Patient Address',
                'x00200010': 'Study ID',
                'x0020000d': 'Study Instance UID',
                'x0020000e': 'Series Instance UID',
                'x00080020': 'Study Date',
                'x00080030': 'Study Time',
                'x00081030': 'Study Description',
                'x00080050': 'Accession Number',
                'x00080090': 'Referring Physician\'s Name',
                'x00200011': 'Series Number',
                'x0008103e': 'Series Description',
                'x00200013': 'Instance Number',
                'x00080008': 'Image Type',
                'x00200032': 'Image Position (Patient)',
                'x00200037': 'Image Orientation (Patient)',
                'x00180050': 'Slice Thickness',
                'x00280030': 'Pixel Spacing',
                'x00280010': 'Rows',
                'x00280011': 'Columns',
                'x00280100': 'Bits Allocated',
                'x00280101': 'Bits Stored',
                'x00280102': 'High Bit',
                'x00280103': 'Pixel Representation',
                'x00281050': 'Window Center',
                'x00281051': 'Window Width',
                'x00080070': 'Manufacturer',
                'x00080080': 'Institution Name',
                'x00081010': 'Station Name',
                'x00181000': 'Device Serial Number',
                'x00181020': 'Software Versions',
                'x00324000': 'Patient Comments',
                'x00321060': 'Requested Procedure Description',
                'x00401001': 'Requested Procedure ID',
                'x00400007': 'Scheduled Procedure Step Description',
                'x00400009': 'Scheduled Procedure Step ID'
            };

            // Loop through tags and display them if present
            for (const tag in tags) {
                if (dataSet.elements[tag]) {
                    const tagName = tags[tag];
                    const tagValue = dataSet.string(tag) || 'N/A';  // Get tag value or 'N/A' if empty
                    const listItem = document.createElement('li');
                    listItem.textContent = `${tagName}: ${tagValue}`;
                    detailsList.appendChild(listItem);
                }
            }
        }
    </script>
    <script src="{{ url_for('static', filename='main.js') }}"></script>
</body>

</html>


<!-- <script>
        // Initialize Cornerstone
        cornerstoneWebImageLoader.external.cornerstone = cornerstone;
        cornerstoneFileImageLoader.external.cornerstone = cornerstone
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.cornerstoneTools = cornerstoneTools;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

        cornerstoneWADOImageLoader.configure({
            useWebWorkers: true,
            webWorkerPath: "https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoaderWebWorker.min.js", // Correct path
            taskConfiguration: {
                'decodeTask': {
                    codecsPath: 'https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoaderCodecs.min.js'
                }
            }
        });

        // Register image loaders
        cornerstone.registerImageLoader('webimage', cornerstoneWebImageLoader.loadImage);
        cornerstone.registerImageLoader('file', cornerstoneFileImageLoader.loadImage);

        // Enable the viewer element
        // const element = document.getElementById('dicomViewer');
        // cornerstone.enable(element);

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

        function displayDICOMDetails(dataSet) {
            const detailsList = document.getElementById('detailsList');
            detailsList.innerHTML = '';  // Clear the list before displaying new metadata

            // Extract and display patient details
            const patientId = dataSet.string('x00100020') || 'N/A';
            const patientName = dataSet.string('x00100010') || 'N/A';
            const patientGender = dataSet.string('x00100040') || 'N/A';
            const patientBirth = dataSet.string('x00100030') || 'N/A';
            const studyDescription = dataSet.string('x0008103e') || 'N/A';
            const studyDate = dataSet.string('x00080020') || 'N/A';

            document.getElementById('patientId').textContent = `${patientId}`;
            document.getElementById('patientName').textContent = `${patientName}`;
            document.getElementById('patientGender').textContent = `${patientGender}`;
            document.getElementById('patientBirth').textContent = `${patientBirth}`;
            document.getElementById('studyDescription').textContent = `Study Description: ${studyDescription}`;
            document.getElementById('studyDate').textContent = `Study Date: ${studyDate}`;

            // // Extract image width and height
            const imageHeight = dataSet.uint16('x00280010') || 'N/A'; // Rows (Height)
            const imageWidth = dataSet.uint16('x00280011') || 'N/A';  // Columns (Width)

            document.getElementById('width').textContent = `Width: ${imageWidth}`;
            document.getElementById('length').textContent = `Length: ${imageHeight}`;

            // Define tags to extract (you can add more tags as needed)
            const tags = {
                'x00100010': 'Patient Name',
                'x00100020': 'Patient ID',
                'x00100030': 'Patient Birth Date',
                'x00100040': 'Patient Gender',
                'x00101010': 'Patient Age',
                'x00101030': 'Patient Weight',
                'x00101020': 'Patient Size',
                'x00101040': 'Patient Address',
                'x00200010': 'Study ID',
                'x0020000d': 'Study Instance UID',
                'x0020000e': 'Series Instance UID',
                'x00080020': 'Study Date',
                'x00080030': 'Study Time',
                'x00081030': 'Study Description',
                'x00080050': 'Accession Number',
                'x00080090': 'Referring Physician\'s Name',
                'x00200011': 'Series Number',
                'x0008103e': 'Series Description',
                'x00200013': 'Instance Number',
                'x00080008': 'Image Type',
                'x00200032': 'Image Position (Patient)',
                'x00200037': 'Image Orientation (Patient)',
                'x00180050': 'Slice Thickness',
                'x00280030': 'Pixel Spacing',
                'x00280010': 'Rows',
                'x00280011': 'Columns',
                'x00280100': 'Bits Allocated',
                'x00280101': 'Bits Stored',
                'x00280102': 'High Bit',
                'x00280103': 'Pixel Representation',
                'x00281050': 'Window Center',
                'x00281051': 'Window Width',
                'x00080070': 'Manufacturer',
                'x00080080': 'Institution Name',
                'x00081010': 'Station Name',
                'x00181000': 'Device Serial Number',
                'x00181020': 'Software Versions',
                'x00324000': 'Patient Comments',
                'x00321060': 'Requested Procedure Description',
                'x00401001': 'Requested Procedure ID',
                'x00400007': 'Scheduled Procedure Step Description',
                'x00400009': 'Scheduled Procedure Step ID'
            };

            // Loop through tags and display them if present
            for (const tag in tags) {
                if (dataSet.elements[tag]) {
                    const tagName = tags[tag];
                    const tagValue = dataSet.string(tag) || 'N/A';  // Get tag value or 'N/A' if empty
                    const listItem = document.createElement('li');
                    listItem.textContent = `${tagName}: ${tagValue}`;
                    detailsList.appendChild(listItem);
                }
            }
        }
    </script> -->
    <!-- <script>

        // Enable the viewer element
        // const element = document.getElementById('dicomViewer');
        // cornerstone.enable(element);

        function displayDICOMDetails(dataSet) {
            const detailsList = document.getElementById('detailsList');
            detailsList.innerHTML = '';  // Clear the list before displaying new metadata

            // Extract and display patient details
            const patientId = dataSet.string('x00100020') || 'N/A';
            const patientName = dataSet.string('x00100010') || 'N/A';
            const patientGender = dataSet.string('x00100040') || 'N/A';
            const patientBirth = dataSet.string('x00100030') || 'N/A';
            const studyDescription = dataSet.string('x0008103e') || 'N/A';
            const studyDate = dataSet.string('x00080020') || 'N/A';

            document.getElementById('patientId').textContent = `${patientId}`;
            document.getElementById('patientName').textContent = `${patientName}`;
            document.getElementById('patientGender').textContent = `${patientGender}`;
            document.getElementById('patientBirth').textContent = `${patientBirth}`;
            document.getElementById('studyDescription').textContent = `Study Description: ${studyDescription}`;
            document.getElementById('studyDate').textContent = `Study Date: ${studyDate}`;

            // // Extract image width and height
            const imageHeight = dataSet.uint16('x00280010') || 'N/A'; // Rows (Height)
            const imageWidth = dataSet.uint16('x00280011') || 'N/A';  // Columns (Width)

            document.getElementById('width').textContent = `Width: ${imageWidth}`;
            document.getElementById('length').textContent = `Length: ${imageHeight}`;

            // Define tags to extract (you can add more tags as needed)
            const tags = {
                'x00100010': 'Patient Name',
                'x00100020': 'Patient ID',
                'x00100030': 'Patient Birth Date',
                'x00100040': 'Patient Gender',
                'x00101010': 'Patient Age',
                'x00101030': 'Patient Weight',
                'x00101020': 'Patient Size',
                'x00101040': 'Patient Address',
                'x00200010': 'Study ID',
                'x0020000d': 'Study Instance UID',
                'x0020000e': 'Series Instance UID',
                'x00080020': 'Study Date',
                'x00080030': 'Study Time',
                'x00081030': 'Study Description',
                'x00080050': 'Accession Number',
                'x00080090': 'Referring Physician\'s Name',
                'x00200011': 'Series Number',
                'x0008103e': 'Series Description',
                'x00200013': 'Instance Number',
                'x00080008': 'Image Type',
                'x00200032': 'Image Position (Patient)',
                'x00200037': 'Image Orientation (Patient)',
                'x00180050': 'Slice Thickness',
                'x00280030': 'Pixel Spacing',
                'x00280010': 'Rows',
                'x00280011': 'Columns',
                'x00280100': 'Bits Allocated',
                'x00280101': 'Bits Stored',
                'x00280102': 'High Bit',
                'x00280103': 'Pixel Representation',
                'x00281050': 'Window Center',
                'x00281051': 'Window Width',
                'x00080070': 'Manufacturer',
                'x00080080': 'Institution Name',
                'x00081010': 'Station Name',
                'x00181000': 'Device Serial Number',
                'x00181020': 'Software Versions',
                'x00324000': 'Patient Comments',
                'x00321060': 'Requested Procedure Description',
                'x00401001': 'Requested Procedure ID',
                'x00400007': 'Scheduled Procedure Step Description',
                'x00400009': 'Scheduled Procedure Step ID'
            };

            // Loop through tags and display them if present
            for (const tag in tags) {
                if (dataSet.elements[tag]) {
                    const tagName = tags[tag];
                    const tagValue = dataSet.string(tag) || 'N/A';  // Get tag value or 'N/A' if empty
                    const listItem = document.createElement('li');
                    listItem.textContent = `${tagName}: ${tagValue}`;
                    detailsList.appendChild(listItem);
                }
            }
        }
    </script> -->



    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DICOM Viewer</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <!------ Cornerstone tools ------->
    <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
    <script src="https://cdn.jsdelivr.net/npm/cornerstone-math@0.1.6/dist/cornerstoneMath.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/cornerstone-core@2.2.4/dist/cornerstone.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-web-image-loader@2.1.0/dist/cornerstoneWebImageLoader.js"></script>

    <!-- development version, includes helpful console warnings -->
    <script src="https://cdn.jsdelivr.net/npm/cornerstone-tools@3.0.0-b.641/dist/cornerstoneTools.js"></script>
    <!-- Load Cornerstone libraries -->
    <script src="https://unpkg.com/dicom-parser@latest/dist/dicomParser.min.js"></script>
    <script src="https://unpkg.com/cornerstone-core/dist/cornerstone.min.js"></script>
    <script src="https://unpkg.com/cornerstone-tools/dist/cornerstoneTools.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.0.6/dist/cornerstoneWADOImageLoader.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-web-image-loader@2.1.1/dist/cornerstoneWebImageLoader.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/cornerstone-file-image-loader@0.3.0/dist/cornerstoneFileImageLoader.min.js"></script>
</head>

<body>
    <header>
        <img src="{{ url_for('static', filename='logoFull.png') }}" alt="Company Logo" class="logo">
        <div class="button-container-wrapper">
            <div class="button-container">
                <!-- <button id="activateWwwc">Window / Level</button> -->
                <button id="activateWwwc" class="icon-button"><span
                        class="material-icons">contrast</span><br>Window / Level</button>
                <button id="layout" onclick="toggleLayoutButton()" class="icon-button"><span
                        class="material-icons">grid_view</span><br>Layout</button>
                <div id="dropdownContent" class="hidden">
                    <a href="#" onclick="createCanvases('1x1')">1 x 1</a>
                    <a href="#" onclick="createCanvases('1x2')">1 x 2</a>
                    <a href="#" onclick="createCanvases('1x3')">1 x 3</a>
                    <a href="#" onclick="createCanvases('2x1')">2 x 1</a>
                    <a href="#" onclick="createCanvases('2x2')">2 x 2</a>
                    <a href="#" onclick="createCanvases('2x3')">2 x 3</a>
                    <a href="#" onclick="createCanvases('3x1')">3 x 1</a>
                    <a href="#" onclick="createCanvases('3x2')">3 x 2</a>
                    <a href="#" onclick="createCanvases('3x3')">3 x 3</a>
                </div>
                <button id="activateInvert" class="icon-button"><span
                        class="material-icons">invert_colors</span><br>Invert</button>
                <button id="activateRectangle" class="icon-button"><span
                        class="material-icons">crop_square</span><br>Rectangle</button>
                <button id="activateCircle" class="icon-button"><span
                        class="material-icons">radio_button_unchecked</span><br>Circle</button>
                <button id="activateElliptical" class="icon-button"><img
                        src="{{ url_for('static', filename='icons/ellipse.png') }}" alt="Elliptical Roi"
                        class="icon-img"><br>Elliptical</button>
                <button id="activateArrowAnnotate" class="icon-button"><span
                        class="material-icons">call_received</span><br>Arrow</button>
                <button id="activatePan" class="icon-button"><span
                        class="material-icons">open_with</span><br>Pan</button>
                <button id="activateZoom" class="icon-button"><span
                        class="material-icons">zoom_in</span><br>Zoom</button>
                <button id="activateMagnify" class="icon-button"><span
                        class="material-icons">search</span><br>Magnify</button>
                <button id="hFlip" type="button" class="icon-button"><img
                        src="{{ url_for('static', filename='icons/hflip.png') }}" alt="HFlip"
                        class="icon-img"><br>HFlip</button>
                <button id="vFlip" type="button" class="icon-button"><img
                        src="{{ url_for('static', filename='icons/vflip.png') }}" alt="VFlip"
                        class="icon-img"><br>VFlip</button>
                <button id="rRotate" type="button" class="icon-button"><span
                        class="material-icons">rotate_right</span><br>R. Right</button>
                <button id="lRotate" type="button" class="icon-button"><span
                        class="material-icons">rotate_left</span><br>R. Left</button>
                <button id="moreButton" onclick="toggleMoreButtons()" class="icon-button"><span
                        class="material-icons">more_horiz</span><br>More</button>

                <!-- Hidden buttons, revealed when "More" is clicked -->
                <div id="moreMenu" class="hidden">
                    <button id="activateRotate" class="icon-button"><span
                            class="material-icons">refresh</span><br>Rotate</button>
                    <button id="activateLength" class="icon-button"><img
                            src="{{ url_for('static', filename='icons/ruler.png') }}" alt="Length"
                            class="icon-img"><br>Length</button>
                    <button id="activateAngle" class="icon-button"><img
                            src="{{ url_for('static', filename='icons/angle.png') }}" alt="Angle"
                            class="icon-img"><br>Angle</button>
                    <button id="activateCobbAngle" class="icon-button"><img
                            src="{{ url_for('static', filename='icons/cobangle.png') }}" alt="Cobb Angle"
                            class="icon-img"><br>Cobb</button>
                    <button id="activateErase" class="icon-button"><img
                            src="{{ url_for('static', filename='icons/eraser.png') }}" alt="Eraser Icon"
                            class="icon-img"><br>Erase</button>
                    <button id="resetTools" class="icon-button"><span
                            class="material-icons">restart_alt</span><br>Reset</button>
                </div>
            </div>
        </div>
        <button id="addFile" class="icon-button"><span class="material-icons">add_circle</span><br>Upload</button>
    </header>
    <!-- <h2>DICOM Viewer</h2> -->
    <div id="block">
        <div id="dicomDetails">
            <h3>DICOM File Details</h3>
            <ul id="detailsList">
                
            </ul>
        </div>
        <div id="dicomViewerContainer">
        <!-- Canvases will be dynamically generated here -->
        </div>
        <!-- <div id="dicomViewer">
            <div id="patientDetails1">
                <div id="patientId">Patient ID: N/A</div>
                <div id="patientName">Patient Name: N/A</div>
                <div id="patientBirth">Patient BirthDate: N/A</div>
                <div id="patientGender">Patient Gender: N/A</div>
            </div>
            <div id="patientDetails2">
                <div id="studyDescription">Study Description: N/A</div>
                <div id="studyDate">Study Date: N/A</div>
            </div>
            <div id="patientDetails3">
                <div id="zoom">Zoom: N/A</div>
                <div id="wwc">Wwc: N/A</div>
            </div>
            <div id="patientDetails4">
                <div id="width">Width: N/A</div>
                <div id="length">Length: N/A</div>
            </div>
        </div> -->
    </div>
    <!-- </div> -->
    <!-- Modal for File Upload -->
    <div id="uploadModal" class="modal hidden">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Upload File</h2>
            <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" id="file" name="file" accept=".dcm, .jpg, .png">
                <input type="submit" value="Upload">
            </form>
        </div>
    </div>
    <h1>Upload and View DICOM Files</h1>

    <h2>Uploaded Files:</h2>
    <ul id="fileList">
        {% for file in files %}
        <li>
            <a draggable="true" href="{{ url_for('uploaded_file', filename=file) }}" data-url="{{ url_for('uploaded_file', filename=file) }}"
                onclick="loadAndViewImage(this, '{{ file }}'); return false;">{{ file }}</a>
        </li>
        {% endfor %}
    </ul>    
    <script src="{{ url_for('static', filename='main.js') }}"></script>
</body>

</html>