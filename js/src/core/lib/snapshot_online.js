export default `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>K3D snapshot viewer - [TIMESTAMP]</title>
    <style>
        body, html {
            background-color: #F5F5F5;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        #canvasTarget {
            width: 100%;
            height: 100%;
            position: absolute;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
    <script src="https://unpkg.com/k3d@[VERSION]/dist/standalone.js"></script>
</head>
<body>
<div id="canvasTarget"></div>

<script>
    var K3DInstance;
    var data = '[DATA]';

    function _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

    require(['k3d'], function (lib) {
        try {
            K3DInstance = new lib.CreateK3DAndLoadBinarySnapshot(
                _base64ToArrayBuffer(data),
                document.getElementById('canvasTarget'),
            );

            K3DInstance.then(function(K3DInstance) {
                [ADDITIONAL]
            });
        } catch (e) {
            console.log(e);
            return;
        }
    });
</script>
</body>
</html>`;