#!/usr/bin/env python3
"""
Image optimization script that gracefully handles missing dependencies.
If optimization fails, it copies existing JPG images as JXL placeholders.
"""
import os
import sys
import shutil
import subprocess

def main():
    # Get the script directory and project paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    public_images_dir = os.path.join(script_dir, '../../public/images')
    jxl_dir = os.path.join(public_images_dir, 'jxl')
    
    try:
        # Try to import required modules
        from PIL import Image
        import pillow_jxl
        print("PIL and pillow-jxl found. Proceeding with image optimization...")
        
        # Run the individual optimization scripts as subprocesses
        scripts = [
            'resize_image.py',
            'convert_to_progressive_jpeg.py', 
            'convert_to_jxl.py'
        ]
        
        for script in scripts:
            script_path = os.path.join(script_dir, script)
            if os.path.exists(script_path):
                print(f"Running {script}...")
                # Execute the script as a subprocess
                try:
                    result = subprocess.run(['python3', script_path], cwd=script_dir, capture_output=True, text=True)
                    if result.returncode == 0:
                        print(f"Successfully ran {script}")
                    else:
                        print(f"Error running {script}: {result.stderr}")
                except Exception as e:
                    print(f"Error running {script}: {e}")
            else:
                print(f"Script not found: {script}")
                
    except ImportError as e:
        print(f"Required Python modules not found: {e}")
        print("Creating fallback JXL images by copying JPG files...")
        
        # Create jxl directory if it doesn't exist
        os.makedirs(jxl_dir, exist_ok=True)
        
        # Copy JPG images to JXL directory as placeholders
        for filename in os.listdir(public_images_dir):
            if filename.lower().endswith(('.jpg', '.jpeg')):
                jpg_path = os.path.join(public_images_dir, filename)
                jxl_filename = filename.rsplit('.', 1)[0] + '.jxl'
                jxl_path = os.path.join(jxl_dir, jxl_filename)
                
                # Copy JPG as JXL placeholder
                shutil.copy2(jpg_path, jxl_path)
                print(f"Created placeholder: {jxl_path}")
        
        print("Using existing JPG images as JXL placeholders.")
        return 0
    
    return 0

if __name__ == "__main__":
    sys.exit(main())