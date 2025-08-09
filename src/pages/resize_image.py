from PIL import Image
import os

def resize_image_keep_aspect_ratio(input_path, output_path, max_dimension=800):
    """
    Resizes an image to fit within a maximum dimension while maintaining aspect ratio.
    
    :param input_path: Path to the input image
    :param output_path: Path to save the output image
    :param max_dimension: Maximum width or height for the resized image
    """
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Get original dimensions
            width, height = img.size
            
            # Calculate new dimensions keeping aspect ratio
            if width > height:
                # Landscape orientation
                new_width = min(width, max_dimension)
                new_height = int((new_width / width) * height)
            else:
                # Portrait or square orientation
                new_height = min(height, max_dimension)
                new_width = int((new_height / height) * width)
            
            # Resize the image with high-quality resampling
            resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with medium quality
            resized_img.save(output_path, 'JPEG', quality=50, optimize=True)
            
        print(f"Image successfully resized and saved to {output_path}")
        print(f"Original size: {width}x{height}, New size: {new_width}x{new_height}")
    except Exception as e:
        print(f"Error processing image: {e}")

def batch_resize_images(input_dir, output_dir, max_dimension=800):
    """
    Batch processes all JPG images in a directory, resizing while maintaining aspect ratio.
    
    :param input_dir: Directory containing input JPG images
    :param output_dir: Directory to save the output JPG images
    :param max_dimension: Maximum width or height for the resized images
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process all JPG files in the input directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            resize_image_keep_aspect_ratio(input_path, output_path, max_dimension)

if __name__ == "__main__":
    # For your specific case with the images in this directory:
    input_dir = '.'
    output_dir = '../../public/images'
    
    # Resize images to have a maximum dimension of 400 pixels
    batch_resize_images(input_dir, output_dir, 400)