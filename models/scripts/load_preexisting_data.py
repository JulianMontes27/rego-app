from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Sure! Preprocessing the data is a critical step in preparing a dataset for training a machine learning model. Let's break it down:

# ---

# ### **1. Converts Images to PyTorch Tensors**

# - **What are images?**  
#   Images are essentially a grid of pixel values. Each pixel has an intensity value (for grayscale) or three values for RGB channels (Red, Green, Blue) if it's a color image.

#   For example:
#   - Grayscale image: \( 28 \times 28 \) matrix where each value is between \( 0 \) and \( 255 \).
#   - RGB image: \( 3 \times 32 \times 32 \) (3 color channels, each \( 32 \times 32 \) grid).

# - **Why convert to tensors?**  
#   PyTorch works with tensors, which are multi-dimensional arrays optimized for GPU and deep learning computations. Converting images to tensors lets PyTorch:
#   1. Efficiently perform mathematical operations (like gradients).
#   2. Pass the data through the neural network.

# - **How does this happen in code?**  
#   Using `transforms.ToTensor()`, pixel values (0–255) are:
#   - Divided by \( 255 \) to scale them into the range \( [0, 1] \).
#   - Converted to floating-point numbers (PyTorch tensors expect this format).

# ---

# ### **2. Normalizes Pixel Values**

# - **Why normalize pixel values?**
#   Neural networks work best when input data is normalized (scaled to have zero mean and unit variance). Without normalization:
#   - Large pixel values (like 255) can dominate calculations, slowing or destabilizing learning.
#   - Different input ranges between features (e.g., RGB channels) can skew the training process.

# - **How normalization works:**
#   Normalization adjusts the pixel values to have a mean of \( 0 \) and standard deviation of \( 1 \). Here's how it's done:
#   \[
#   x_{\text{normalized}} = \frac{x - \mu}{\sigma}
#   \]
#   - \( x \): Original pixel value.
#   - \( \mu \): Mean of the dataset (e.g., average intensity of all pixels in an image channel).
#   - \( \sigma \): Standard deviation of the dataset.

# - **In PyTorch:**
#   The normalization happens with:
#   ```python
#   transforms.Normalize(mean=(0.5,), std=(0.5,))
#   ```
#   This scales the pixel values to the range \( [-1, 1] \):
#   - \( x_{\text{normalized}} = \frac{x - 0.5}{0.5} \)

#   If your data has 3 channels (RGB), you provide the mean and std for each:
#   ```python
#   transforms.Normalize(mean=(0.5, 0.5, 0.5), std=(0.5, 0.5, 0.5))
#   ```

# ---

# ### **Combining Both Steps**

# Here’s what happens:
# 1. **Original Image**: \( 32 \times 32 \), pixel values range \( [0, 255] \).
# 2. **`transforms.ToTensor()`**:
#    - Divides by \( 255 \).
#    - Converts to a tensor with range \( [0, 1] \).
# 3. **`transforms.Normalize()`**:
#    - Subtracts \( \mu = 0.5 \) (mean).
#    - Divides by \( \sigma = 0.5 \) (std).
#    - Scales values to \( [-1, 1] \).

# ---

# ### **Why Normalize to [-1, 1]?**

# 1. **Improves Convergence**: Scaled inputs make the optimization process (backpropagation) faster and more stable.
# 2. **Better Use of Activation Functions**: Many activations (like tanh or sigmoid) perform better when inputs are centered around \( 0 \).

# ---

# ### Example

# Here’s an example of preprocessing for CIFAR-10:

# ```python
# from torchvision import transforms

# transform = transforms.Compose([
#     transforms.ToTensor(),  # Scale pixel values to [0, 1]
#     transforms.Normalize(mean=(0.5, 0.5, 0.5), std=(0.5, 0.5, 0.5))  # Normalize to [-1, 1]
# ])
# ```

# If the original RGB pixel value is `[128, 64, 200]`, here's what happens:
# 1. **`ToTensor` Step**:  
#    Divides each value by 255:
#    \[
#    [128, 64, 200] \to [0.501, 0.251, 0.784]
#    \]

# 2. **`Normalize` Step**:  
#    Applies normalization for each channel:
#    \[
#    \text{Red Channel: } \frac{0.501 - 0.5}{0.5} = 0.002
#    \]
#    \[
#    \text{Green Channel: } \frac{0.251 - 0.5}{0.5} = -0.498
#    \]
#    \[
#    \text{Blue Channel: } \frac{0.784 - 0.5}{0.5} = 0.568
#    \]

# The final normalized tensor is:
# \[
# [0.002, -0.498, 0.568]
# \]


def load_preexisting_dataset(dataset_name="CIFAR10", batch_size=32):
    # Define transformations
    transform = transforms.Compose([
        transforms.ToTensor(),  # Convert to tensor
        transforms.Normalize((0.5,), (0.5,))  # Normalize images
    ])

    # Load the dataset
    if dataset_name == "CIFAR10":
        train_dataset = datasets.CIFAR10(root="./data", train=True, download=True, transform=transform)
        val_dataset = datasets.CIFAR10(root="./data", train=False, download=True, transform=transform)
    elif dataset_name == "MNIST":
        train_dataset = datasets.MNIST(root="./data", train=True, download=True, transform=transform)
        val_dataset = datasets.MNIST(root="./data", train=False, download=True, transform=transform)
    else:
        raise ValueError("Unsupported dataset. Try 'CIFAR10' or 'MNIST'.")

    # Create DataLoaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    return train_loader, val_loader
