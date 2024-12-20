import torch.nn as nn
import torch.nn.functional as F

#

class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        #convolutional layer 1
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        #convolutional layer 2
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        
        #Effect: reduce the spatial dimensions (HxW) by half
        #Shape change: Input: (N,64,32,32) ; Output: (64, 32, 32)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        
        self.fc1 = nn.Linear(64 * 16 * 16, 128)  # Ensure correct input size
        self.fc2 = nn.Linear(128, 10)  # output should match the number of classes of the dataset (10 classes for CIFAR-10)

    def forward(self, x):
        # x is the input tensor, which is a bach of images of shape (N, C, H, W):
        # N: Batch size (number of images processed at once)
        # C: Number of channels (e.g.,3 for RGB images)
        # H: Height of the image (e.g.,32 pixels for CIFAR-10)
        # W: Width of the image (e.g., 32 pixels for CIFAR-10)
        x = F.relu(self.conv1(x))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)  # Flatten for fully connected layer
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x


# class CNN(nn.Module):
#     # Note: The __init__() function is called automatically every time the class is being used to create a new object.
#     # Note: The self parameter is a reference to the current instance of the class, and is used to access variables that belong to the class.
#     def __init__(self):
#         #ensure base class is properly initializeds
#         super(CNN, self).__init__()
#         # Convolutional layers
#         #these layers apply filters to detect patterns in the input
#         self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)  # Input: 3x32x32 -> Output: 32x32x32
#         self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1) # Input: 32x32x32 -> Output: 64x32x32
#         self.pool = nn.MaxPool2d(2, 2)  # Downsample spatial dimensions by 2

#         # Fully connected layers
#         self.fc1 = nn.Linear(64 * 8 * 8, 512)  # Input: Flattened 64x8x8 -> Output: 512
#         self.fc2 = nn.Linear(512, 10)          # Output: 10 (for CIFAR-10 classes)

#     def forward(self, x):
#         # Pass through the first conv layer
#         x = F.relu(self.conv1(x))
#         x = self.pool(F.relu(self.conv2(x)))  # Conv -> ReLU -> Pool
#         x = x.view(-1, 64 * 8 * 8)            # Flatten for FC layers
#         x = F.relu(self.fc1(x))               # FC1 -> ReLU
#         x = self.fc2(x)                       # Output layer (no activation here, will use CrossEntropyLoss)
#         return x

        