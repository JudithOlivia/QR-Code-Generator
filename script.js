document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - testing JS')
    let currentLogo = null;
    
    const generateBtn = document.getElementById('generateBtn');
    const qrtext = document.getElementById('qrtext');
    const qrContainer = document.getElementById('qrContainer');
    const qrCanvas = document.getElementById('qrCanvas');
    const errorDiv = document.getElementById('errorDiv');
    const logoUpload = document.getElementById('logoUpload');
    const logoFile = document.getElementById('logoFile');
    const logoPreview = document.getElementById('logoPreview');
    const previewImg = document.getElementById('previewImg');
    const removeLogoBtn = document.getElementById('removeLogoBtn');
    const emojiInput = document.getElementById('emojiInput'); 
    const downloadPNG = document.getElementById('downloadPNG');
    const downloadJPG = document.getElementById('downloadJPG');

    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded');
        if (errorDiv) {
            errorDiv.textContent = 'Error: QR library failed to load';
            errorDiv.classList.add('show');
        }
        return;
    }

    console.log('QRCode library loaded successfully');

    async function generateQRCode() {
        console.log('Generate button clicked');

        const text = qrtext.value.trim();
        const qrColor = document.getElementById('qrColor').value;
        const bgColor = document.getElementById('bgColor').value;
        const size = parseInt(document.getElementById('qrSize').value);

        console.log('Text:', text);
        console.log('Size:', size);
        console.log('QR Color:', qrColor);
        console.log('BG Color:', bgColor);
        
        if (!text) {
            errorDiv.classList.add('show');
            return;
        }

        errorDiv.classList.remove('show');
        try {
            console.log('Gnerating QR..');

            qrCanvas.width = size;
            qrCanvas.height = size;

            await QRCode.toCanvas(qrCanvas, text, {
                width: size,
                margin: 2,
                color: {
                    dark: qrColor,
                    light: bgColor
                },
                errorCorrectionLevel: 'H'
            });

            if (currentLogo) {
                try {
                    await addLogoToQR(qrCanvas, currentLogo);
                    console.log('Logo added successfully.');
                } catch (logoError) {
                    console.error('Error adding logo:', logoError);
                }
            }

            qrContainer.style.display = 'block';
            console.log('OR generated successfully');
        } catch (error) {
            console.error('Error generating QR:', error);
            errorDiv.textContent = 'Error: ' + error.message;
            errorDiv.classList.add('show');
        }
    }
    async function addLogoToQR(canvas, logoUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                console.log('Adding logo to QR');
                const ctx = canvas.getContext('2d');
                const size = canvas.width;
                const logoSize = size * 0.2;
                const x = (size - logoSize) / 2;
                const y = (size - logoSize) / 2;
                
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
                
                
                ctx.strokeStyle = '#CCCCCC';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
                
              
                ctx.drawImage(img, x, y, logoSize, logoSize);
                resolve();
            };
            img.onerror = (error) => {
                console.error('Error loading logo image:', error);
                reject(error);
            };
            img.src = logoUrl;
        });
    } 

    generateBtn.addEventListener('click', generateQRCode);

    setTimeout(function(){
        if (qrtext.value ==='') {
            qrtext.value = 'https://example.com';
            generateQRCode();
        }
    }, 100);

    logoUpload.addEventListener('click', () =>{
        logoFile.click();
    })

    logoFile.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentLogo = event.target.result;
                previewImg.src = currentLogo;
                logoPreview.style.display = 'flex';
                emojiInput.value = ''; 
                console.log('Logo loaded successfully');
            };
            reader.onerror = (error) => {
                console.error('Error loading logo:', error);
            };
            reader.readAsDataURL(e.target.files[0]); 
        }
    });

    removeLogoBtn.addEventListener('click', () => {
        currentLogo = null;
        logoPreview.style.display = 'none';
        logoFile.value = '';
        previewImg.src = '';
        console.log('Logo removed');
        generateQRCode(); 
    });

    emojiInput.addEventListener('input', (e) =>{
        if (e.target.value) {
        console.log('Emoji entered:', e.target.value);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx.font = '70px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.target.value, 50, 50);
        currentLogo = canvas.toDataURL();
        previewImg.src = currentLogo;
        logoPreview.style.display = 'flex';
        generateQRCode();
        }
    });


    function downloadQR(format) {
        if (!qrCanvas || !qrCanvas.toDataURL) {
            console.error('No QR code to download');
        }

        try {
            const link = document.createElement('a');
            if (format === 'png') {
                link.download = `qrcode_${Date.now()}.png`;
                link.href = qrCanvas.toDataURL('image/png');
            } else if (format === 'jpg') {
                link.download = `qrcode_${Date.now()}.jpg`;
                link.href = qrCanvas.toDataURL('image/jpeg', 0.9);
            }
            link.click();
            console.log('Download as', format);
        } catch (error) {
            console.error('Error downloading:', error);
        }
    }

    if (downloadPNG) downloadPNG.addEventListener('click', () => downloadQR('png'));
    if (downloadJPG) downloadJPG.addEventListener('click', () => downloadQR('jpg'));

});

