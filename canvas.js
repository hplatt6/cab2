(function() {
    function initCanvas() {
        var canvas = document.getElementById('drawingCanvas');
        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }

        var ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Canvas context not available!");
            return;
        }

        var isDrawing = false;
        var brushColor = '#000000';
        var brushSize = 5;

        setCanvasSize();
        setBrushColor(brushColor);
        setBrushSize(brushSize);

        function setCanvasSize() {
            var container = document.getElementById('canvasContainer');
            canvas.width = container.offsetWidth;
            canvas.height = canvas.width / 5 * 3;
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

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        // Mouse event listeners
        canvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            var pos = getMousePos(canvas, e);
            ctx.beginPath();
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
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            ctx.beginPath();
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
            brushColor = this.value;
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
            ctx.lineWidth = brushSize;
        });

        // Clear button handling
        document.getElementById('clearButton').addEventListener('click', function(e) {
            e.preventDefault();
            clearCanvas();
        });

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Function to add canvas data to Qualtrics embedded data
        function addCanvasDataToEmbeddedData() {
            const myCanvas = document.getElementById('drawingCanvas');
            if (myCanvas) {
                const dataURL = myCanvas.toDataURL('image/png');
                const base64Data = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');

                if (typeof Qualtrics !== 'undefined' && typeof Qualtrics.SurveyEngine !== 'undefined') {
                    Qualtrics.SurveyEngine.setJSEmbeddedData('canvasImage', base64Data);
                    console.log("Canvas data (base64) set to Qualt-rics embedded data: canvasImage");
                } else {
                    console.log("Qualtrics not detected. Returning base64 data.");
                    return base64Data;
                }
            } else {
                console.error('Canvas element not found. Ensure that the canvas has the id "drawingCanvas"');
                if (typeof Qualtrics !== 'undefined' && typeof Qualtrics.SurveyEngine !== 'undefined') {
                    Qualtrics.SurveyEngine.setJSEmbeddedData('canvasImage', "about:blank");
                } else {
                    return "about:blank";
                }
            }
        }

        // Get the save button element.
        var saveButton = document.getElementById("saveButton");

        // Add event listener to the save button.
        if (saveButton) {
            saveButton.addEventListener("click", addCanvasDataToEmbeddedData);
        }

        // Resize event listener to handle orientation changes
        window.addEventListener('resize', setCanvasSize);
    }

    if (typeof Qualtrics !== 'undefined' && typeof Qualtrics.SurveyEngine !== 'undefined') {
        Qualtrics.SurveyEngine.addOnReady(initCanvas);
        console.log("qualtrics detected");
    } else {
        initCanvas();
        console.log("qualtrics not detected");
    }
})();