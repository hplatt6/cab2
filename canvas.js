window.onload = function() {
    var canvas = document.getElementById('drawingCanvas');
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var brushColor = '#000000';
    var brushSize = 5;

    function setCanvasSize() {
        canvas.width = document.getElementById('canvasContainer').offsetWidth;
        canvas.height = canvas.offsetWidth / 3 * 5;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function setBrushColor(color) {
        brushColor = color;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }

    function setBrushSize(size) {
        brushSize = size;
        ctx.lineWidth = size;
    }

    setBrushColor(brushColor);
    setBrushSize(brushSize);

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        ctx.beginPath();
        var pos = getMousePos(canvas, e);
        ctx.moveTo(pos.x, pos.y);
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

    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });

    canvas.addEventListener('mouseout', function() {
        isDrawing = false;
    });

    function handleTouchStart(e) {
        e.preventDefault();
        isDrawing = true;
        ctx.beginPath();
        var rect = canvas.getBoundingClientRect();
        var touch = e.touches[0];
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
        ctx.lineWidth = brushSize;
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (isDrawing) {
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
        }
    }

    function handleTouchEnd() {
        isDrawing = false;
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    document.getElementById('colorPicker').addEventListener('input', function() {
        brushColor = this.value;
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
    });

    document.getElementById('colorButtons').addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            brushColor = e.target.dataset.color;
            ctx.strokeStyle = brushColor;
            ctx.fillStyle = brushColor;
        }
    });

    document.getElementById('brushSizeSlider').addEventListener('input', function() {
        brushSize = this.value;
        ctx.lineWidth = brushSize;
    });

    document.getElementById('clearButton').addEventListener('click', function(e) {
        e.preventDefault();
        clearCanvas();
    });

    function sendBase64ToPipedream() {
        const myCanvas = document.getElementById('drawingCanvas');
        if (myCanvas) {
            const dataURL = myCanvas.toDataURL('image/png');
            const base64Data = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');

            const pipedreamEndpoint = 'https://eo19wfj05vqf6o9.m.pipedream.net';

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

    var saveButton = document.getElementById("saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", sendBase64ToPipedream);
    } else {
        console.error("Save button not found");
    }

    // Orientation Change Handling
    window.addEventListener('orientationchange', function() {
        localStorage.setItem('canvasData', canvas.toDataURL());
    });

    // Restore Canvas Data
    if (localStorage.getItem('canvasData')) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            localStorage.removeItem('canvasData');
        };
        img.src = localStorage.getItem('canvasData');
    }
};