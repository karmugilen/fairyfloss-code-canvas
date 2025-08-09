from PIL import Image
import os

def reduce_image_quality(input_path, output_path, quality=50):
    """
    Reduces the quality of a JPG image while keeping the original resolution.
    
    :param input_path: Path to the input JPG image
    :param output_path: Path to save the output JPG image
    :param quality: Quality of the output image (1-100, where 100 is best quality)
    """
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Save the image with reduced quality (same dimensions)
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
        print(f"Image quality successfully reduced and saved to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")

def batch_reduce_quality(input_dir, output_dir, quality=50):
    """
    Batch processes all JPG images in a directory, reducing only quality.
    
    :param input_dir: Directory containing input JPG images
    :param output_dir: Directory to save the output JPG images
    :param quality: Quality of the output images (1-100)
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process all JPG files in the input directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            reduce_image_quality(input_path, output_path, quality)

if __name__ == "__main__":
    # For your specific case with the images in this directory:
    input_dir = '.'
    output_dir = './reduced_quality_images'
    
    # Reduce quality to 10% (very heavy compression to get under 20KB)
    batch_reduce_quality(input_dir, output_dir, 10)