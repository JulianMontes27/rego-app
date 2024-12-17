# Training loop
# print("Starting training...")
# for epoch in range(num_epochs):
#     running_loss = 0.0
#     for i, (inputs, labels) in enumerate(trainloader):
#         inputs, labels = inputs.to(device), labels.to(device)

#         # Zero gradients
#         optimizer.zero_grad()

#         # Forward pass
#         outputs = model(inputs)
#         loss = criterion(outputs, labels)

#         # Backward pass
#         loss.backward()
#         optimizer.step()

#         # Accumulate loss
#         running_loss += loss.item()

#         # Print every 200 batches
#         if (i + 1) % 200 == 0:
#             print(f"[Epoch {epoch+1}, Batch {i+1}] Loss: {running_loss / 200:.4f}")
#             running_loss = 0.0

# # Save model checkpoint
# torch.save(model.state_dict(), '../checkpoints/cnn_model.pth')
# print("Training complete. Model saved!")