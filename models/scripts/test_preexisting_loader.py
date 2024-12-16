from load_preexisting_data import load_preexisting_dataset

if __name__ == "__main__":
    train_loader, val_loader = load_preexisting_dataset(dataset_name="CIFAR10", batch_size=32)
    for images, labels in train_loader:
        print(f"Batch of images: {images.shape}")  # Should print: [batch_size, 3, 32, 32]
        print(f"Batch of labels: {labels}")        # Should print a list of integers
        break
