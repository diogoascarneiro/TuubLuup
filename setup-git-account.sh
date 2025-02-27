#!/bin/bash

# Script to set up a different Git account for this repository

echo "Setting up Git configuration for this repository only..."

# Prompt for user information
read -p "Enter your Git username for this project: " GIT_USERNAME
read -p "Enter your Git email for this project: " GIT_EMAIL

# Set Git configuration locally (only for this repository)
git config user.name "$GIT_USERNAME"
git config user.email "$GIT_EMAIL"

# Verify the configuration
echo -e "\nGit configuration for this repository:"
echo "Username: $(git config user.name)"
echo "Email: $(git config user.email)"

echo -e "\nConfiguration complete! This Git account will only be used for this repository."
echo "Your global Git configuration remains unchanged." 