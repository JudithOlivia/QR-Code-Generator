document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - testing JS')

    const generateBtn = document.getElementById('generateBtn');
    const qrtext = document.getElementById('qrtext');
    const qrContainer = document.getElementById('qrContainer');
    const qrCanvas = document.getElementById('qrCanvas');
    const errorDiv = document.getElementById('errorDiv');

    if (typeof ORCode === 'undefined') {
        console.error('QRCode library not loaded');
        errorDiv.textContent = 'Error: QR library failed to load';
        errorDiv.classList.add('show');
        return;
    }

    console.log('QRCode library loaded successfully');

    async function generateQRCode() {
        console.log('Generate button clicked');

        const text = qrtext.value.trim();

        if (!text) {
            console.log('No text entered');
            errorDiv.classList.add('show');
            return;
        }

        errorDiv.classList.remove('show');

        try {
            console.log('Generating QR for:', text);

            qrCanvas.width = 512;
            qrCanvas.height = 512;

            await generateQRCode.toCanvas(qrCanvas, text, { width: 512, margin: 2, errorCorrectionLevel: 'H'})

            qrContainer.style.display = 'block';
            console.log('QR generated successfully');

        } catch (error) {
            console.error('Error generating QR code:', error);
            errorDiv.textContent = 'Error generating QR code';
            errorDiv.classList.add('show');
        }
    }

    generateBtn.addEventListener('click', generateQR);

    setTimeout(function(){
        if (qrtext.value ==='') {
            qrtext.value = 'https://example.com';
            generateQR();
        }
    }, 100);

});