from PIL import Image
import os
import pillow_jxl  # Import to register JXL support

def convert_to_jxl(input_path, output_path, quality=85, size=(800, 800), effort=7):
    """
    Convert image to JPEG XL format with optimization for progressive decoding
    
    :param input_path: Path to input image
    :param output_path: Path to save output JXL image
    :param quality: JPEG XL quality (1-100)
    :param size: Maximum dimensions for resizing
    :param effort: Encoding effort (1-9, higher = better compression but slower)
    """
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize image maintaining aspect ratio
            img.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Save as JPEG XL optimized for progressive decoding
            # JPEG XL has inherent progressive capabilities
            img.save(
                output_path, 
                'JXL', 
                quality=quality, 
                effort=effort,
                use_container=True,  # Enable container format for streaming
                compress_metadata=True  # Compress metadata for smaller files
            )
            
        print(f"Successfully converted {input_path} to JPEG XL: {output_path}")
        print(f"Original size: {os.path.getsize(input_path)} bytes")
        print(f"JPEG XL size: {os.path.getsize(output_path)} bytes")
        
    except Exception as e:
        print(f"Error converting {input_path}: {e}")

def batch_convert_to_jxl(input_dir, output_dir, quality=85, size=(800, 800), effort=7):
    """
    Batch convert images to JPEG XL format
    
    :param input_dir: Directory containing input images
    :param output_dir: Directory to save output JXL images
    :param quality: JPEG XL quality (1-100)
    :param size: Maximum dimensions for resizing
    :param effort: Encoding effort (1-9)
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process all JPG/PNG files in the input directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            input_path = os.path.join(input_dir, filename)
            output_filename = filename.rsplit('.', 1)[0] + '.jxl'
            output_path = os.path.join(output_dir, output_filename)
            convert_to_jxl(input_path, output_path, quality, size, effort)

if __name__ == "__main__":
    import os
    
    # Get the current script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Convert main images to JPEG XL
    input_dir = os.path.join(script_dir, '../../public/images')
    output_dir = os.path.join(script_dir, '../../public/images/jxl')
    
    print(f"Input directory: {input_dir}")
    print(f"Output directory: {output_dir}")
    
    # Convert to JPEG XL with good quality for progressive loading
    batch_convert_to_jxl(input_dir, output_dir, quality=85, size=(800, 800), effort=7)