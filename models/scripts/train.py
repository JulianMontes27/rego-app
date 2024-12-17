# importing sys
import sys
import os

# Dynamically append the root directory to the system path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ROOT_DIR)

from model.cnn import CNN  # Import the CNN model

import torch
from torch import optim
from load_preexisting_data import load_preexisting_dataset

# Hyperparameters
learning_rate = 0.001
num_epochs = 10
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize the model
model = CNN().to(device)

# Get the Loaders (the training loader for this case)
train_loader, val_loader = load_preexisting_dataset()

# Loss function and optimizer
criterion = torch.nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# Training loop
print("Starting training...")
for epoch in range(num_epochs):
    running_loss = 0.0
    for i, (inputs, labels) in enumerate(train_loader):
        print(f"Batch {i+1}: Inputs shape: {inputs.shape}, Labels shape: {labels.shape}")
        inputs, labels = inputs.to(device), labels.to(device)

        # Forward pass
        outputs = model(inputs)
        print(f"Outputs shape: {outputs.shape}")

        # Break early for debugging
        break

# Ensure checkpoint directory exists
checkpoint_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'checkpoints'))
os.makedirs(checkpoint_dir, exist_ok=True)

# Save the model
torch.save(model.state_dict(), os.path.join(checkpoint_dir, 'cnn_model.pth'))
print("Training complete. Model saved!")

model.load_state_dict(torch.load("model.pth"))
