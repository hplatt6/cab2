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
        var brushColor = '#000000'; // Default to black
        var brushSize = 5;

        // Generate a UUID
        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Set the unique ID in the hidden input
        let uniqueId = uuidv4();
        document.getElementById('uniqueId').value = uniqueId;


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
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var x = (e.clientX - rect.left) * scaleX;
            var y = (e.clientY - rect.top) * scaleY;

            return { x: x, y: y };
        }

        // Mouse event listeners
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
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var x = (touch.clientX - rect.left) * scaleX;
            var y = (touch.clientY - rect.top) * scaleY;

            ctx.moveTo(x, y);
            ctx.strokeStyle = brushColor;
            ctx.fillStyle = brushColor;
            ctx.lineWidth = brushSize;
        }, { passive: false });

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (isDrawing) {
                var rect = canvas.getBoundingClientRect();
                var touch = e.touches[0];
                var scaleX = canvas.width / rect.width;
                var scaleY = canvas.height / rect.height;
                var x = (touch.clientX - rect.left) * scaleX;
                var y = (touch.clientY - rect.top) * scaleY;

                ctx.lineTo(x, y);
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
            ctx.lineWidth = size;
        });

        // Clear button handling
        document.getElementById('clearButton').addEventListener('click', function(e) {
            e.preventDefault();
            clearCanvas();
        });

        // Function to add canvas data to Qualtrics embedded data or return base 64
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
                    body: JSON.stringify({
                        imageData: base64Data,
                        uniqueId: uniqueId // Include the unique ID
                    })
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
        } else {
            console.error("Save button not found");
        }

        // Resize event listener to handle orientation changes
        window.addEventListener('orientationchange', function() {
            // Save current canvas data
            localStorage.setItem('canvasData', JSON.stringify({
                data: canvas.toDataURL(),
                width: canvas.width,
                height: canvas.height
            }));
            handleOrientationChange();
        });

        function handleOrientationChange() {
            if (localStorage.getItem('canvasData')) {
                var savedData = JSON.parse(localStorage.getItem('canvasData'));
                var img = new Image();

                img.onload = function() {
                    setCanvasSize(); // Resize canvas
                    ctx.drawImage(img, 0, 0, savedData.width, savedData.height, 0, 0, canvas.width, canvas.height); // Draw scaled image
                };

                img.src = savedData.data;
                localStorage.removeItem('canvasData');
            } else {
                setCanvasSize(); // Just resize if no saved data
            }
        }


        // Restore canvas data on initial load
        if (localStorage.getItem('canvasData')) {
            handleOrientationChange();
        }
    }

    initCanvas();
})();