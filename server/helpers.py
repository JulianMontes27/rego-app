from PIL import Image
from io import BytesIO

from fastapi import HTTPException

import numpy as np


# import aiohttp
# from io import BytesIO
# from PIL import Image

# #Asynchronous Support: FastAPI is built on Starlette, which is asynchronous, and httpx integrates seamlessly with async code. This means that while FastAPI handles other requests, it can continue downloading images without blocking the event loop. This results in better performance and responsiveness, especially under load.
# #Concurrency: httpx supports asynchronous requests, allowing you to make multiple HTTP calls concurrently without blocking your server. If you need to download several images or perform other I/O operations, you can do them in parallel, improving efficiency.

# # For instance, if you need to process several images at once, you can use async features with httpx to download all of them concurrently
# async def download_image(file_url: str) -> Image.Image:
#     async with aiohttp.ClientSession() as session:
#         async with session.get(file_url) as response:
#             if response.status != 200:
#                 raise HTTPException(status_code=400, detail="Failed to fetch the image.")
#             content = await response.read()
#             image = Image.open(BytesIO(content))  # Convert bytes to an image object
#             return image



######
#verify an image
def verifyImageBytes (image_bytes:bytes):
    """
    Validates the given image bytes by attempting to open and verify it.

    Args:
        image_bytes (bytes): The image content in bytes.

    Returns:
        Image.Image: The validated PIL Image object.

    Raises:
        HTTPException: If the image is invalid.
    """
    try: 
        # Attempt to open the image
        image = Image.open(BytesIO(image_bytes))
        # Verify the image integrity
        image.verify()
        # Re-open the image in case verification invalidates it
        image = Image.open(BytesIO(image_bytes))
        return image

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}") 


#process the image
def preprocess_image(image: Image.Image, target_size: tuple[int, int]= (224,224)):
    """
    Preprocesses the PIL Image for AI model inference.

    Args:
        image (Image.Image): The input PIL Image.
        target_size (tuple[int, int]): Desired size for the image (width, height).

    Returns:
        np.ndarray: The preprocessed image as a NumPy array ready for inference.
    """

    try:
        # Resize the image to the target size
        image = image.resize(target_size)

        # Convert to RGB (in case the image is grayscale or has an alpha channel)
        image = image.convert("RGB")

        # Convert to NumPy array
        image_array = np.array(image)

        # Normalize pixel values to range [0, 1] (assuming the model expects this range)
        image_array = image_array / 255.0

        # Add a batch dimension (assuming the model expects batches)
        image_array = np.expand_dims(image_array, axis=0)

        return image_array


    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Image preprocessing failed: {e}")



###