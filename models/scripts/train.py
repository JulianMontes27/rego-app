import torch
from torch import optim
from load_preexisting_data import load_preexisting_dataset
import sys
import os

# Dynamically append the root directory to the system path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ROOT_DIR)
from model.cnn import CNN  # Import the CNN model

# Hyperparameters
learning_rate = 0.001
num_epochs = 10
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize the model
model = CNN().to(device)

# Get the Loaders (the training loader for this case)
train_loader, val_loader = load_preexisting_dataset()

# Loss function to calculate how well the models predictions compare to the labels and optimizer to update the models parameters based on the gradients
loss_fn_criterion = torch.nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# Ensure checkpoint directory exists
checkpoint_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'checkpoints'))
os.makedirs(checkpoint_dir, exist_ok=True)

# Training loop
print("Starting training...")

# Check if a checkpoint exists to resume training
checkpoint_path = os.path.join(checkpoint_dir, 'latest_checkpoint.pth')
start_epoch = 0

if os.path.exists(checkpoint_path):
    print("Checkpoint found. Resuming training...")
    checkpoint = torch.load(checkpoint_path)
    model.load_state_dict(checkpoint['model_state_dict'])
    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    start_epoch = checkpoint['epoch'] + 1  # Resume from the next epoch
    print(f"Resuming training from epoch {start_epoch}...")
else:
    print("No checkpoint found. Starting training from scratch...")

# Training loop continues from here
for epoch in range(start_epoch, num_epochs):
    running_loss = 0.0
    for i, (inputs, labels) in enumerate(train_loader):
        inputs, labels = inputs.to(device), labels.to(device)

        # Forward pass
        outputs = model(inputs)

        # Compute loss
        loss = loss_fn_criterion(outputs, labels)

        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        
        # Print log after each batch (ensure this is not inside any conditional logic)
        print(f"Epoch [{epoch+1}/{num_epochs}], Batch [{i+1}/{len(train_loader)}], Loss: {loss.item():.4f}")


    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss/len(train_loader):.4f}")

    # Save model checkpoint at each epoch
    checkpoint_path = os.path.join(checkpoint_dir, 'latest_checkpoint.pth')
    torch.save({
        'epoch': epoch + 1,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'loss': running_loss
    }, checkpoint_path)
    print(f"Checkpoint saved: {checkpoint_path}")

# Final save after training completes
torch.save(model.state_dict(), os.path.join(checkpoint_dir, 'cnn_model.pth'))
print("Training complete. Model saved!")
