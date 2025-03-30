console.log("Canvas.js loaded inside iframe."); // Check if the file is loaded

(function() {
    function initCanvas() {
        var canvas = document.getElementById('drawingCanvas');
        var saveButton = document.getElementById('saveButton');

        console.log("Canvas element:", canvas);
        console.log("Save button element:", saveButton);

        function saveCanvasData() {
            const myCanvas = document.getElementById('drawingCanvas');
            if (myCanvas) {
                const dataURL = myCanvas.toDataURL('image/png');
                const base64Data = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');

                if (window.parent && window.parent.Qualtrics && window.parent.Qualtrics.SurveyEngine) {
                    window.parent.Qualtrics.SurveyEngine.setJSEmbeddedData('canvasImage', base64Data);
                    console.log("Canvas data (base64) set to Qualtrics embedded data: canvasImage");
                } else {
                    console.log("Qualtrics not detected. Returning base64 data.");
                    return base64Data;
                }
            } else {
                console.error('Canvas element not found. Ensure that the canvas has the id "drawingCanvas"');
                if (window.parent && window.parent.Qualtrics && window.parent.Qualtrics.SurveyEngine) {
                    window.parent.Qualtrics.SurveyEngine.setJSEmbeddedData('canvasImage', "about:blank");
                } else {
                    return "about:blank";
                }
            }
        }

        if (saveButton) {
            saveButton.addEventListener("click", saveCanvasData);
        }
    }

    if (window.parent && window.parent.Qualtrics && window.parent.Qualtrics.SurveyEngine) {
        Qualtrics.SurveyEngine.addOnReady(initCanvas);
        console.log("qualtrics detected");
    } else {
        initCanvas();
        console.log("qualtrics not detected");
    }
})();