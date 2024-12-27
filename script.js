document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const downloadBtn = document.getElementById('downloadAll');
    const resetBtn = document.getElementById('resetBtn');
    
    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#34a853';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4285f4';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4285f4';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImage(files[0]);
        }
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImage(e.target.files[0]);
        }
    });

    // 处理图片
    function handleImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                generateIcons(img);
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 生成不同尺寸的图标
    function generateIcons(sourceImg) {
        const sizes = [16, 32, 48, 128];
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // 使用双线性插值算法
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // 绘制图片
            ctx.drawImage(sourceImg, 0, 0, size, size);
            
            // 显示预览
            const preview = document.getElementById(`preview${size}`);
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');
            preview.appendChild(img);
        });
    }

    // 修改下载按钮的事件处理
    document.addEventListener('click', (e) => {
        if (e.target.closest('.download-single-btn')) {
            const btn = e.target.closest('.download-single-btn');
            const size = btn.dataset.size;
            const preview = document.getElementById(`preview${size}`);
            const img = preview.querySelector('img');
            if (img) {
                const link = document.createElement('a');
                link.download = `icon${size}.png`;
                link.href = img.src;
                link.click();
            }
        }
    });

    // 重置
    resetBtn.addEventListener('click', () => {
        uploadArea.style.display = 'block';
        previewArea.style.display = 'none';
        imageInput.value = '';
    });
}); 