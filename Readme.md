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


// window.addEventListener('load', function () {
//     const fileLinks = document.querySelectorAll('#previewList div div');
//     fileLinks.forEach(function (linkElement) {
//         const fileName = linkElement.getAttribute('data-filename');
//         console.log("File Name:", fileName);
//         cornerstone.enable(linkElement);
//         loadAndViewImage(linkElement, fileName);

//         // Handle the drag manually since Cornerstone overrides the default draggable behavior
//         linkElement.addEventListener('dragstart', function (event) {
//             event.dataTransfer.setData('text/plain', fileName);
//             console.log('Dragging:', fileName);
//         });
//     });
// });

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


window.onload = function () {
    const draggableDivs = document.querySelectorAll('#previewList .draggable');

    draggableDivs.forEach(function (draggableDiv) {
        // Set up drag event
        draggableDiv.addEventListener('dragstart', function (e) {
            const url = 'http://127.0.0.1:5000' + draggableDiv.dataset.url;
            e.dataTransfer.setData('text/uri-list', url);
            e.dataTransfer.setData('text/plain', draggableDiv.innerText);
            console.log('Dragging:', url);
            loadAndViewImage(draggableDiv, url);
        });
    });

    // // Select all the <a> tags inside the previewList
    // const links = document.querySelectorAll('#previewList a');
    // const block = document.getElementById('previewList');
    // console.log({ block });
    // // Loop through each <a> tag and log the href attribute
    // links.forEach(function (link) {
    //     console.log(link.href); // Logs the full URL of each link
    //     const draggableDiv = document.createElement('div');
    //     draggableDiv.className = 'draggable';
    //     draggableDiv.draggable = true;
    //     draggableDiv.innerText = link.innerText; // Set the file name as the div's content
    //     draggableDiv.dataset.url = link.dataset.url; // Add data-url attribute to the div
    //     draggableDiv.dataset.filename = link.innerText; // Add the filename to the div

    //     // Set up drag event
    //     draggableDiv.addEventListener('dragstart', function (e) {
    //         const url = 'http://127.0.0.1:5000' + draggableDiv.dataset.url;
    //         e.dataTransfer.setData('text/uri-list', url);
    //         e.dataTransfer.setData('text/plain', draggableDiv.innerText);
    //         console.log('Dragging:', url); 

    //         // e.dataTransfer.setData('text/uri-list', draggableDiv.dataset.url);
    //         // e.dataTransfer.setData('text/plain', draggableDiv.dataset.filename);
    //     });

    //     // const url = event.dataTransfer.getData('text/uri-list');
    //     // Append the draggable div to the block
    //     block.appendChild(draggableDiv);
    // });

    const targetCanvas = document.querySelector('.dicomViewer'); // Adjust selector as needed

    targetCanvas.addEventListener('dragover', handleDragOver);
    targetCanvas.addEventListener('drop', handleDrop);
};











  {% for file in files %}
                                <!-- <li>
                                        <a draggable="true" href="{{ url_for('uploaded_file', filename=file) }}"
                                                data-url="{{ url_for('uploaded_file', filename=file) }}"
                                                onclick="loadAndViewImage(this, '{{ file }}'); return false;">{{ file
                                                }}</a>
                                </li> -->
                                <div class="previewSquare" draggable="true"
                                        data-url="{{ url_for('uploaded_file', filename=file) }}"
                                        style="flex: 1 0 45%; margin: -1px; border: 1px solid #ccc; padding: 10px; text-align: center;">
                                        <div class="draggable" draggable="true"
                                                data-url="{{ url_for('uploaded_file', filename=file) }}">
                                                {{ file }}
                                        </div>
                                </div>
                                {% endfor %}






24/09/2024
<div id="preview-{{ loop.index }}" style="width: 40px; height: 100px;">
                                                        {% set file_ext = file.split('.')[-1].lower() %}
                                                        {% if file_ext == 'jpg' or file_ext == 'jpeg' or file_ext ==
                                                        'png' %}
                                                        <!-- Show image preview for JPG -->
                                                        <img src="{{ url_for('uploaded_file', date=date, filename=file) }}"
                                                                alt="{{ file }}" style="width: 660%; height: 100px;" />

                                                        {% elif file_ext == 'dcm' %}
                                                        <!-- DICOM preview area -->
                                                        <canvas id="dicomCanvas-{{ loop.index }}"
                                                        style="width: 660%; height: 100%;"></canvas>

                                                        <script>
                                                                var dicomUrl = 'http://localhost:5000' + "{{ url_for('uploaded_file', date=date, filename=file) }}";
                                                                console.log({ dicomUrl });
                                                                fetch(dicomUrl)
                                                                        .then(response => response.arrayBuffer())
                                                                        .then(buffer => {
                                                                                try {
                                                                                        const dicomParser = window.dicomParser;
                                                                                        const dataSet = dicomParser.parseDicom(new Uint8Array(buffer));
                                                                                        const pixelDataElement = dataSet.elements.x7fe00010;
                                                                                        if (!pixelDataElement) {
                                                                                                console.error('No pixel data found in DICOM file');
                                                                                                return;
                                                                                        }

                                                                                        const pixelData = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
                                                                                        const rows = dataSet.uint16('x00280010');
                                                                                        const cols = dataSet.uint16('x00280011');

                                                                                        const canvas = document.getElementById("dicomCanvas-{{ loop.index }}");
                                                                                        const ctx = canvas.getContext('2d');
                                                                                        canvas.width = cols;
                                                                                        canvas.height = rows;

                                                                                        const imageData = ctx.createImageData(cols, rows);
                                                                                        for (let i = 0; i < pixelData.length; i++) {
                                                                                                const value = pixelData[i];
                                                                                                imageData.data[i * 4] = value;      // Red
                                                                                                imageData.data[i * 4 + 1] = value;  // Green
                                                                                                imageData.data[i * 4 + 2] = value;  // Blue
                                                                                                imageData.data[i * 4 + 3] = 255;    // Alpha (fully opaque)
                                                                                        }
                                                                                        ctx.putImageData(imageData, 0, 0);

                                                                                        const pngDataUrl = canvas.toDataURL('image/png');
                                                                                        console.log(pngDataUrl);
                                                                                } catch (err) {
                                                                                        console.error('Error parsing DICOM file', err);
                                                                                }
                                                                        });
                                                        </script>

                                                        {% else %}
                                                        <!-- Show message for unsupported file type -->
                                                        <p>File preview not available</p>

                                                        {% endif %}
                                                </div>


 <!-- {% for date, files in files_by_date.items() %}
                                <h4>{{ date }}</h4>
                                {% for file in files %}
                                <div class="previewSquare" draggable="true"
                                        data-url="{{ url_for('uploaded_file', date=date, filename=file) }}"
                                        style="flex: 1 0 45%; margin: 5px; border: 1px solid #ccc; padding: 10px; text-align: center;">
                                        <div class="draggable" draggable="true"
                                                data-url="{{ url_for('uploaded_file', date=date, filename=file) }}">
                                                <div id="preview-{{ loop.index }}" style="width: 80px; height: 100px; align-items: center;">
                                                </div>
                                        </div>
                                </div>
                                {% endfor %}
                                {% endfor %} -->



                                <!-- <div style="display: flex; flex-wrap: wrap; gap: 0; justify-content: flex-start;">
                                    {% for file in files %}
                                    <div class="previewSquare" draggable="true"
                                         data-url="{{ url_for('uploaded_file', date=date, filename=file) }}"
                                         style="flex: 0 1 calc(33.33% - 0px); border: 1px solid #ccc; padding: 0px; text-align: center; box-sizing: border-box;">
                                        <div class="draggable" draggable="true"
                                             data-url="{{ url_for('uploaded_file', date=date, filename=file) }}">
                                            <div id="preview-{{ loop.index }}"
                                                 style="width: 50px; height: 50px; align-items: center;">
                                            </div>
                                        </div>
                                    </div>
                                    {% endfor %}
                                </div> -->







Button
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
                                                src="{{ url_for('static', filename='icons/ellipse.png') }}"
                                                alt="Elliptical Roi" class="icon-img"><br>Elliptical</button>
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
                                                        src="{{ url_for('static', filename='icons/ruler.png') }}"
                                                        alt="Length" class="icon-img"><br>Length</button>
                                        <button id="activateAngle" class="icon-button"><img
                                                        src="{{ url_for('static', filename='icons/angle.png') }}"
                                                        alt="Angle" class="icon-img"><br>Angle</button>
                                        <button id="activateCobbAngle" class="icon-button"><img
                                                        src="{{ url_for('static', filename='icons/cobangle.png') }}"
                                                        alt="Cobb Angle" class="icon-img"><br>Cobb</button>
                                        <button id="activateCrosshair" class="icon-button"><img
                                                        src="{{ url_for('static', filename='icons/crosshairs.png') }}"
                                                        alt="Crosshair" class="icon-img"><br>Crosshair</button>
                                        <button id="activateStackScroll" class="icon-button"><img
                                                        src="{{ url_for('static', filename='icons/layer.png') }}"
                                                        alt="StackScroll" class="icon-img"><br>StackScroll</button>
                                        <button id="activateCine" class="icon-button"><span
                                                        class="material-icons">play_arrow</span><br>Cine</button>
                                        <button id="activateErase" class="icon-button"><img
                                                        src="{{ url_for('static', filename='icons/eraser.png') }}"
                                                        alt="Eraser Icon" class="icon-img"><br>Erase</button>
                                        <button id="resetTools" class="icon-button"><span
                                                        class="material-icons">restart_alt</span><br>Reset</button>
                                </div>
                        </div>



//converter code

# import pydicom
# from pydicom.dataset import Dataset
# from pydicom.uid import generate_uid
# from pydicom.dataelem import DataElement
# from PIL import Image
# import numpy
# import uuid
# import datetime

# # Your input file here
# INPUT_FILE = r"C:\Users\BAPS\Downloads\onh_os_BScan_2023-11-11,18.05\sample\onh_os-001.jpg"

# # Name for output DICOM
# dicomized_filename = str(uuid.uuid4()) + '.dcm'

# # Load image with Pillow
# img = Image.open(INPUT_FILE)
# width, height = img.size
# print("File format is {} and size: {}, {}".format(img.format, width, height))

# # Convert PNG and BMP files
# if img.format == 'PNG' or img.format == 'BMP':
#     img = img.convert('RGB')

# # Convert image modes (types/depth of pixels)
# # Docs: https://pillow.readthedocs.io/en/3.1.x/handbook/concepts.html
# if img.mode == 'L':
#     np_frame = ds.PixelData = np_frame.tobytes()
# elif img.mode == 'RGBA' or img.mode == 'RGB':
#     np_frame = numpy.array(img.getdata(), dtype=numpy.uint8)
# else:
#     print("Unknown image mode")
#     raise ValueError(f"Unknown image mode: {img.mode}")

# # Get the current datetime
# dt = datetime.datetime.now()

# # Create DICOM from scratch
# ds = Dataset()
# ds.file_meta = Dataset()
# ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian
# ds.file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.1.1'
# ds.file_meta.MediaStorageSOPInstanceUID = "1.2.3"
# ds.file_meta.ImplementationClassUID = "1.2.3.4"

# # Add additional patient and study information
# ds.PatientName = "Test^Name"
# ds.PatientID = "00-000-000"
# ds.PatientBirthDate = "19900101"  # Format: YYYYMMDD
# ds.StudyDate = dt.strftime('%Y%m%d')
# ds.StudyTime = dt.strftime('%H%M%S.%f')
# ds.PatientSex = "O"  # 'O' for Other
# ds.Modality = "OT"  # 'OT' for Other modality
# ds.StudyID = "1"
# ds.SeriesNumber = 1

# # Setting the StudyDescription using the correct DICOM tag
# study_description = DataElement(0x0008103E, 'SH', "Sample study description")  # (0008, 103E)
# ds.add(study_description)  # Add the DataElement to the dataset

# ds.Rows = img.height
# ds.Columns = img.width
# ds.PhotometricInterpretation = "YBR_FULL_422"
# if np_frame.shape[1] == 3:
#     ds.SamplesPerPixel = 3
# else:
#     ds.SamplesPerPixel = 1
# ds.BitsStored = 8
# ds.BitsAllocated = 8
# ds.HighBit = 7
# ds.PixelRepresentation = 0
# ds.PlanarConfiguration = 0
# ds.NumberOfFrames = 1

# ds.SOPClassUID = generate_uid()
# ds.SOPInstanceUID = generate_uid()
# ds.StudyInstanceUID = generate_uid()
# ds.SeriesInstanceUID = generate_uid()

# ds.PixelData = np_frame

# ds.is_little_endian = True
# ds.is_implicit_VR = False

# ds.save_as(dicomized_filename, write_like_original=False)

# ######## Working Sample 2 ##########
# import pydicom
# from pydicom.dataset import Dataset
# from pydicom.uid import generate_uid
# from pydicom.dataelem import DataElement
# from PIL import Image
# import numpy as np
# import uuid
# import datetime

# # Your input file here
# INPUT_FILE = r"C:\Users\BAPS\Downloads\onh_os_BScan_2023-11-11,18.05\sample\onh_os-001.jpg"  # Change this to your actual file

# # Name for output DICOM
# dicomized_filename = str(uuid.uuid4()) + '.dcm'

# # Load image with Pillow
# img = Image.open(INPUT_FILE)
# width, height = img.size
# print("File format is {} and size: {}, {}".format(img.format, width, height))

# # Convert PNG, BMP, and JPEG files to RGB
# if img.format in ['PNG', 'BMP', 'JPEG', 'JPG']:  # Handle JPEG formats
#     img = img.convert('RGB')

# # Convert image modes (types/depth of pixels)
# if img.mode == 'L':  # Grayscale
#     np_frame = np.array(img, dtype=np.uint8)  # Convert to numpy array
# elif img.mode in ['RGBA', 'RGB']:
#     np_frame = np.array(img, dtype=np.uint8)  # Convert to numpy array
# else:
#     print("Unknown image mode")
#     raise ValueError(f"Unknown image mode: {img.mode}")

# # Get the current datetime
# dt = datetime.datetime.now()

# # Create DICOM from scratch
# ds = Dataset()
# ds.file_meta = Dataset()
# ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian
# ds.file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.1.1'
# ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()  # Use a generated UID for instance
# ds.file_meta.ImplementationClassUID = "1.2.3.4"

# # Add additional patient and study information
# ds.PatientName = "Test^Name"
# ds.PatientID = "00-000-000"
# ds.PatientBirthDate = "19900101"  # Format: YYYYMMDD
# ds.StudyDate = dt.strftime('%Y%m%d')
# ds.StudyTime = dt.strftime('%H%M%S.%f')
# ds.PatientSex = "O"  # 'O' for Other
# ds.Modality = "OT"  # 'OT' for Other modality
# ds.StudyID = "1"
# ds.SeriesNumber = 1

# # Setting the StudyDescription using the correct DICOM tag
# study_description = DataElement(0x0008103E, 'SH', "Sample study description")  # (0008, 103E)
# ds.add(study_description)  # Add the DataElement to the dataset

# # Set image attributes
# ds.Rows = img.height
# ds.Columns = img.width
# ds.PhotometricInterpretation = "YBR_FULL_422" if img.mode == 'RGB' else "MONOCHROME2"

# # Determine SamplesPerPixel based on the image data
# if img.mode == 'RGB':  # RGB
#     ds.SamplesPerPixel = 3
# else:
#     ds.SamplesPerPixel = 1

# ds.BitsStored = 8
# ds.BitsAllocated = 8
# ds.HighBit = 7
# ds.PixelRepresentation = 0
# ds.PlanarConfiguration = 0
# ds.NumberOfFrames = 1

# # Generate unique identifiers
# ds.SOPClassUID = generate_uid()
# ds.SOPInstanceUID = generate_uid()
# ds.StudyInstanceUID = generate_uid()
# ds.SeriesInstanceUID = generate_uid()

# # Set pixel data
# ds.PixelData = np_frame.tobytes()

# # Set endianness
# ds.is_little_endian = True
# ds.is_implicit_VR = False

# # Save the DICOM file
# ds.save_as(dicomized_filename, write_like_original=False)
# print(f"Saved DICOM file as: {dicomized_filename}")



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












@app.route('/upload', methods=['POST'])
def upload_file():
     if 'file' not in request.files:
        return redirect(request.url)
    
     files = request.files.getlist('file')  # Get a list of all uploaded files
    
     if not files or len(files) == 0:
        return redirect(request.url)
    
     # Check if the user selected to convert to DCM
     convert_option = request.form.get('convertOption', 'no')
     
     # List to store images if converting to DCM
     images_to_convert = []

     # Default value for upload_date in case no files are saved normally
     upload_date = None

     # Process each file in the list
     for file in files:
        if file and allowed_file(file.filename):
            if convert_option == 'yes':
                 # Read the file stream and convert it into a NumPy array that cv2 can understand
                file_bytes = np.frombuffer(file.read(), np.uint8)  # Read the file contents as bytes
                image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)  # Decode the bytes into an image array

                if image is not None:
                        print(f"Image read successfully: {file.filename} (shape: {image.shape})")
                        images_to_convert.append(image)
                else:
                    print(f"Error reading image from file: {file.filename}")
            else:
                # Save the original file normally
                upload_date, filename = save_file(file)

   # Convert to DICOM only if there are images to convert
     if convert_option == 'yes' and images_to_convert:
        if upload_date is None:
            upload_date = datetime.now().strftime('%Y-%m-%d')  # Fallback if not set
        dcm_filename = convert_to_dcm(images_to_convert, upload_date)
        print(f"DICOM File Saved: {dcm_filename}")

    
     return redirect(url_for('index'))

def convert_to_dcm(images, upload_date):
    # This function will contain the logic for converting images to DICOM
    # It should encapsulate the code you've provided for creating the DICOM file
    dicomized_filename = str(uuid.uuid4()) + '.dcm'

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
    study_description = DataElement(0x0008103E, 'SH', "Sample study")
    ds.add(study_description)

    # List to hold pixel data for all frames
    pixel_data_frames = []

    # Process each image in the input
    for img in images:
        # Convert image to PIL format
        pil_image = Image.fromarray(img)

        # Convert to RGB if needed
        if pil_image.mode in ['L', 'RGBA']:
            pil_image = pil_image.convert('RGB')

        # Convert image to numpy array
        np_frame = np.array(pil_image)

        if np_frame.ndim == 3:
            pixel_data_frames.append(np_frame)
        else:
            print(f"Unsupported image mode: {pil_image.mode}")

    # Check if there are frames to process
    if not pixel_data_frames:
        raise ValueError("No valid frames found to create DICOM file.")

    # Set dimensions and other attributes for the DICOM file
    first_frame_shape = pixel_data_frames[0].shape
    ds.Rows, ds.Columns = first_frame_shape[:2]
    ds.NumberOfFrames = len(pixel_data_frames)

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
    multi_frame_pixel_data = b''.join(frame.tobytes() for frame in pixel_data_frames)
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




# def convert_to_dcm(images, upload_date, target_size=(512, 512)):
#     # This function will contain the logic for converting images to DICOM
#     dicomized_filename = os.path.join('uploads', str(uuid.uuid4()) + '.dcm')

#     # Create a new DICOM dataset
#     ds = Dataset()
#     ds.file_meta = Dataset()
#     ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian
#     ds.file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.14.1'  # Multi-frame True Color Image Storage
#     ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()
#     ds.file_meta.ImplementationClassUID = "1.2.3.4"

#     # Add patient and study information
#     ds.PatientName = "Test^Name"
#     ds.PatientID = "00-000-000"
#     ds.PatientBirthDate = "19900101"  # Format: YYYYMMDD
#     ds.StudyDate = upload_date
#     ds.StudyTime = datetime.now().strftime('%H%M%S.%f')
#     ds.PatientSex = "O"  # 'O' for Other
#     ds.Modality = "OT"  # 'OT' for Other modality
#     ds.StudyID = "1"
#     ds.SeriesNumber = 1

#     # Set study description (shorter than 16 characters)
#     study_description = pydicom.dataelem.DataElement(0x0008103E, 'SH', "Sample study")
#     ds.add(study_description)

#     # List to hold pixel data for all frames
#     pixel_data_frames = []

#     # Process each image in the input
#     for img in images:
#         # Convert image to PIL format
#         pil_image = Image.fromarray(img)

#         # Convert to RGB if needed
#         if pil_image.mode in ['L', 'RGBA']:
#             pil_image = pil_image.convert('RGB')

#         # Resize image while maintaining aspect ratio and padding with black
#         pil_image.thumbnail(target_size, Image.ANTIALIAS)
#         new_image = Image.new("RGB", target_size, (0, 0, 0))  # Create a black background
#         new_image.paste(pil_image, ((target_size[0] - pil_image.width) // 2, 
#                                       (target_size[1] - pil_image.height) // 2))

#         # Convert image to numpy array
#         np_frame = np.array(new_image)

#         if np_frame.ndim == 3:
#             pixel_data_frames.append(np_frame)
#         else:
#             print(f"Unsupported image mode: {pil_image.mode}")

#     # Check if there are frames to process
#     if not pixel_data_frames:
#         raise ValueError("No valid frames found to create DICOM file.")

#     # Set dimensions and other attributes for the DICOM file
#     first_frame_shape = pixel_data_frames[0].shape
#     ds.Rows, ds.Columns = first_frame_shape[:2]
#     ds.NumberOfFrames = len(pixel_data_frames)

#     if first_frame_shape[2] == 3:
#         ds.PhotometricInterpretation = "RGB"
#         ds.SamplesPerPixel = 3
#     else:
#         ds.PhotometricInterpretation = "MONOCHROME2"
#         ds.SamplesPerPixel = 1

#     # Set common DICOM pixel attributes
#     ds.BitsStored = 8
#     ds.BitsAllocated = 8
#     ds.HighBit = 7
#     ds.PixelRepresentation = 0
#     ds.PlanarConfiguration = 0

#     # Combine frames into a single pixel array for multi-frame DICOM
#     multi_frame_pixel_data = b''.join(frame.tobytes() for frame in pixel_data_frames)
#     ds.PixelData = multi_frame_pixel_data

#     # Set remaining attributes
#     ds.SOPClassUID = '1.2.840.10008.5.1.4.1.1.14.1'
#     ds.SOPInstanceUID = generate_uid()
#     ds.StudyInstanceUID = generate_uid()
#     ds.SeriesInstanceUID = generate_uid()

#     ds.is_little_endian = True
#     ds.is_implicit_VR = False

#     # Save the multi-frame DICOM file
#     ds.save_as(dicomized_filename, write_like_original=False)
#     return dicomized_filename



 <button id="activateEnface" class="icon-button" onclick="selectFolder()"><img
                                                src="{{ url_for('static', filename='icons/ai.png') }}" alt="Enface"
                                                class="icon-img"><br>Enface</button>
                                <!-- <button id="activateEnface" class="icon-button" onclick="selectFolder()"><span
                                                class="material-icons">image</span><br>Enface</button> -->
                                <input type="file" id="folderInput" webkitdirectory directory style="display:none;"
                                        onchange="processFolder()" />


# # Modified route to process uploaded images in-memory
# @app.route('/process_enface', methods=['POST'])
# def process_enface():
#     try:
#         # Create a list to store images
#         images = []

#         # Read each uploaded file directly into OpenCV
#         for i in range(512):
#             # Read file as bytes and convert to a NumPy array
#             file = request.files[f'file{i}'].read()
#             np_img = np.frombuffer(file, np.uint8)
            
#             # Decode the image using OpenCV
#             img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#             if img is None:
#                 return jsonify({'error': f"Image at index {i} could not be read."}), 400
#             images.append(img)

#         # Call enface processing module using in-memory images
#         enface_image, contrast_image = perform_enface_processing(images)

#          # Create a folder for the current date
#         upload_date = datetime.now().strftime('%Y-%m-%d')
       
#         # Save processed images to disk using the save_image function
#         enface_filename, enface_filepath = save_image(enface_image, upload_date, 'enface')
#         contrast_filename, contrast_filepath = save_image(contrast_image, upload_date, 'contrast')

#         # Return the paths of the saved images in JSON response
#         return jsonify({
#             'enface_image_path': enface_filepath,
#             'contrast_image_path': contrast_filepath
#         }), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500



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

def resize_image(image, target_shape):
    """
    Resize the given image to match the target shape.
    Args:
        image (np.array): The image to resize.
        target_shape (tuple): The target shape (height, width).
    Returns:
        np.array: The resized image.
    """
    return cv2.resize(image, (target_shape[1], target_shape[0]))  # Resize to (width, height)

@app.route('/process_enface', methods=['POST'])
def process_enface():
    try:
        # Create a list to store images
        images = []
        target_shape = None  # Track the target shape to enforce uniform dimensions
        file_paths = request.json.get('file_paths', [])  # Assuming file paths are sent in the request body as JSON

        for file_path in file_paths:
            # Check if the file exists
            if not os.path.isfile(file_path):
                return jsonify({'error': f"File path '{file_path}' does not exist."}), 400

            # Check if the file is a DICOM file
            if file_path.lower().endswith('.dcm'):
                try:
                    # Read the DICOM file directly from the file system
                    dicom_file = pydicom.dcmread(file_path)
                    
                    # Extract frames (assuming frames are stored in the pixel array)
                    pixel_array = dicom_file.pixel_array
                    num_frames = pixel_array.shape[0]
                    
                    for i in range(num_frames):
                        # Convert each frame to a NumPy image
                        img = pixel_array[i, :, :].astype(np.uint8)  # Convert to uint8 if necessary

                        # Set target shape if it's not defined yet
                        if target_shape is None:
                            target_shape = img.shape  # Set the first image's shape as the target shape
                        else:
                            # If the current image shape does not match the target, resize it
                            if img.shape != target_shape:
                                img = resize_image(img, target_shape)

                        images.append(img)
                except Exception as dicom_error:
                    return jsonify({'error': f"Failed to read DICOM file at '{file_path}': {str(dicom_error)}"}), 400
            else:
                # For non-DICOM files, assume standard image formats (e.g., .png, .jpg)
                img = cv2.imread(file_path, cv2.IMREAD_COLOR)
                if img is None:
                    return jsonify({'error': f"Image at '{file_path}' could not be read."}), 400

                # Set target shape if it's not defined yet
                if target_shape is None:
                    target_shape = img.shape  # Set the first image's shape as the target shape
                else:
                    # If the current image shape does not match the target, resize it
                    if img.shape != target_shape:
                        img = resize_image(img, target_shape)

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



//working enface module
# Modified route to process uploaded DICOM file
@app.route('/process_enface', methods=['POST'])
def process_enface():
    try:
        # Get the file paths from the request
        file_paths = request.json.get('file_paths', [])
        if not file_paths:
            return jsonify({'error': "File paths are required."}), 400

      
        # Construct the absolute file path
        relative_file_path = file_paths[0]
        absolute_file_path = os.path.join(app.config['UPLOAD_FOLDER'], relative_file_path.lstrip('/uploads'))


        if not os.path.isfile(absolute_file_path):
            return jsonify({'error': f"File path '{absolute_file_path}' does not exist."}), 400

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





from pydicom.dataset import FileDataset
import numpy as np

# Assuming `pixel_array` is the 512 frames data
ds = FileDataset("output.dcm", {}, file_meta=meta, preamble=b"\0" * 128)

# Convert your pixel array to the required format
ds.PixelData = pixel_array.tobytes()

# Specify JPEG compression (use other compression options if needed)
ds.compress('JPEG')  # This applies JPEG compression

# Save the file
ds.save_as("compressed_output.dcm")
Udaya Bhaskar
9:29 PM
ds = FileDataset("output.dcm", {}, file_meta=meta, preamble=b"\0" * 128)

# Assuming `frames` is a list or 3D array of 512x512 frames
ds.NumberOfFrames = len(frames)
ds.PixelData = np.stack(frames).tobytes()  # Convert to bytes for DICOM

ds.save_as("output.dcm")


recomended size=60-70mb