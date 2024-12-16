import matplotlib.pyplot as plt
import numpy as np
from load_preexisting_data import load_preexisting_dataset
from torchvision import datasets  # For accessing CIFAR10 class names

def show_images(images, labels, classes):
    fig, axes = plt.subplots(1, 5, figsize=(15, 3))
    for i, ax in enumerate(axes):
        img = np.transpose(images[i].numpy(), (1, 2, 0))  # Convert to HWC for plotting
        img = img * 0.5 + 0.5  # Unnormalize (assuming normalization was mean=0.5, std=0.5)
        ax.imshow(img)
        ax.set_title(f"Label: {classes[labels[i]]}")
        ax.axis('off')
    plt.show()

if __name__ == "__main__":
    # Load dataset
    train_loader, val_loader = load_preexisting_dataset(dataset_name="CIFAR10", batch_size=32)
    # classes = datasets.CIFAR10.classes  # Class names in CIFAR10 dataset
    classes = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
    
    # Visualize a single batch
    for images, labels in train_loader:
        show_images(images, labels, classes)
        break
