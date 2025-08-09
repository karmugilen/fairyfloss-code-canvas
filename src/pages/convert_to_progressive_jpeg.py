from PIL import Image, ImageOps
import os

def convert_to_progressive_jpeg(input_path, output_path, quality=85, size=(800, 800)):
    """
    Convert PNG to progressive JPEG with optimization
    
    :param input_path: Path to input PNG image
    :param output_path: Path to save output progressive JPEG
    :param quality: JPEG quality (1-100)
    :param size: Maximum dimensions for resizing
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
            
            # Save as progressive JPEG
            img.save(
                output_path, 
                'JPEG', 
                quality=quality, 
                optimize=True, 
                progressive=True
            )
            
        print(f"Successfully converted {input_path} to progressive JPEG: {output_path}")
        print(f"Original size: {os.path.getsize(input_path)} bytes")
        print(f"Progressive JPEG size: {os.path.getsize(output_path)} bytes")
        
    except Exception as e:
        print(f"Error converting {input_path}: {e}")

def batch_convert_to_progressive_jpeg(input_dir, output_dir, quality=85, size=(800, 800)):
    """
    Batch convert PNG images to progressive JPEG
    
    :param input_dir: Directory containing input PNG images
    :param output_dir: Directory to save output progressive JPEGs
    :param quality: JPEG quality (1-100)
    :param size: Maximum dimensions for resizing
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process all PNG files in the input directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith('.png'):
            input_path = os.path.join(input_dir, filename)
            output_filename = filename.replace('.png', '.jpg')
            output_path = os.path.join(output_dir, output_filename)
            convert_to_progressive_jpeg(input_path, output_path, quality, size)

if __name__ == "__main__":
    # Convert images in the pages directory
    input_dir = '.'
    output_dir = '../../public/images'
    
    # Convert to progressive JPEG with good quality
    batch_convert_to_progressive_jpeg(input_dir, output_dir, quality=85, size=(800, 800))
    
    # Also create smaller versions for faster loading
    small_output_dir = '../../public/images/small'
    os.makedirs(small_output_dir, exist_ok=True)
    batch_convert_to_progressive_jpeg(input_dir, small_output_dir, quality=75, size=(400, 400))