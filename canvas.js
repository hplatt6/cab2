Qualtrics.SurveyEngine.addOnReady(function () {
    var canvas = document.getElementById('drawingCanvas');
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var brushColor = '#000000'; // Default to black
    var brushSize = 5;

    // Function to set canvas size
    function setCanvasSize() {
        canvas.width = document.getElementById('canvasContainer').offsetWidth;
        canvas.height = canvas.offsetWidth / 3 * 5;
    }

    // Set initial canvas size
    setCanvasSize();

    // Add resize event listener
    window.addEventListener('resize', setCanvasSize);

    // Function to clear the canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Function to set initial brush color and size
    function setBrushColor(color) {
        brushColor = color;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }

    function setBrushSize(size) {
        brushSize = size;
        ctx.lineWidth = size;
    }

    // Set initial brush
    setBrushColor(brushColor);
    setBrushSize(brushSize);

    // Mouse event listeners
    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        e.preventDefault();
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
        ctx.lineWidth = brushSize;
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            var pos = getMousePos(canvas, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        isDrawing = false;
    });

    canvas.addEventListener('mouseout', function(e) {
        isDrawing = false;
    });

    // Touch event listeners
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDrawing = true;
        ctx.beginPath();
        var rect = canvas.getBoundingClientRect();
        var touch = e.touches[0];
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
        ctx.lineWidth = brushSize;
    }, { passive: false });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isDrawing) {
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
        }
    }, { passive: false });

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        isDrawing = false;
    }, { passive: false });

    canvas.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        isDrawing = false;
    }, { passive: false });

    // Color picker handling
    document.getElementById('colorPicker').addEventListener('input', function() {
        brushColor = this.value; // Update the brushColor variable
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
    });

    // Color button click handling
    document.getElementById('colorButtons').addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            brushColor = e.target.dataset.color;
            ctx.strokeStyle = brushColor;
            ctx.fillStyle = brushColor;
        }
    });

    // Brush size slider handling
    document.getElementById('brushSizeSlider').addEventListener('input', function() {
        brushSize = this.value;
        ctx.lineWidth = size;
    });

    // Clear button handling
    document.getElementById('clearButton').addEventListener('click', function(e) {
        e.preventDefault();
        clearCanvas();
    });

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Function to send base64 data to Pipedream
    function sendBase64ToPipedream() {
        const myCanvas = document.getElementById('drawingCanvas');
        if (myCanvas) {
            const dataURL = myCanvas.toDataURL('image/png');
            const base64Data = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');

            const pipedreamEndpoint = 'https://eo19wfj05vqf6o9.m.pipedream.net'; // Your Pipedream endpoint

            fetch(pipedreamEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageData: base64Data })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Base64 data sent to Pipedream successfully!');
                } else {
                    console.error('Failed to send Base64 data to Pipedream.');
                }
            })
            .catch(error => {
                console.error('Error sending Base64 data to Pipedream:', error);
            });
        } else {
            console.error('Canvas element not found.');
        }
    }

    // Get the save button element.
    var saveButton = document.getElementById("saveButton");

    // Add event listener to the save button.
    if (saveButton) {
        saveButton.addEventListener("click", sendBase64ToPipedream);
    }

    // Function to set initial brush color
    function setBrushColor(color) {
        brushColor = color;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }

    // Function to set initial brush size
    function setBrushSize(size) {
        brushSize = size;
        ctx.lineWidth = size;
    }

    // Set initial brush
    setBrushColor(brushColor);
    setBrushSize(brushSize);
});

Qualtrics.SurveyEngine.addOnUnload(function() {
    /*Place your JavaScript here to run when the page is unloaded*/
});