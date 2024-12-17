import torch

#load the saved model checkpoint
checkpoint_path = 'c:/Users/rlsan/Documents/dev/rego-app/models/checkpoints/cnn_model.pth'
checkpoint = torch.load(checkpoint_path)

# Check the model's state_dict (the learned parameters)
print(checkpoint)

# If the checkpoint contains other information like the optimizer state, you can print those too
if 'optimizer' in checkpoint:
    print(checkpoint['optimizer'])

# Example of printing the model's state_dict keys (layer names and parameters)
for key, value in checkpoint.items():
    print(f"{key}: {value.shape}")
