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
            canvas.height = canvas.width / 5 * 3; // Correct aspect ratio calculation
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

        // ... (rest of the code) ...
    }
    // ... (rest of the code) ...
})();