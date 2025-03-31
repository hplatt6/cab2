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
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        var x = (e.clientX - rect.left) * scaleX;
        var y = (e.clientY - rect.top) * scaleY;

        console.log("clientX:", e.clientX, "clientY:", e.clientY);
        console.log("rect.left:", rect.left, "rect.top:", rect.top);
        console.log("scaleX:", scaleX, "scaleY:", scaleY);
        console.log("x:", x, "y:", y);

        return { x: x, y: y };
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
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        var x = (touch.clientX - rect.left) * scaleX;
        var y = (touch.clientY - rect.top) * scaleY;

        console.log("touch.clientX:", touch.clientX, "touch.clientY:", touch.clientY);
        console.log("rect.left:", rect.left, "rect.top:", rect.top);
        console.log("scaleX:", scaleX, "scaleY:", scaleY);
        console.log("x:", x, "y:", y);

        ctx.moveTo(x, y);
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
        ctx.lineWidth = brushSize;
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (isDrawing) {
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var x = (touch.clientX - rect.left) * scaleX;
            var y = (touch.clientY - rect.top) * scaleY;

            console.log("touch.clientX:", touch.clientX, "touch.clientY:", touch.clientY);
            console.log("rect.left:", rect.left, "rect.top:", rect.top);
            console.log("scaleX:", scaleX, "scaleY:", scaleY);
            console.log("x:", x, "y:", y);

            ctx.lineTo(x, y);
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

    // ... (rest of the code: color picker, brush size, clear, save, orientation)
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