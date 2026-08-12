#!/bin/bash

# Simple Interest Calculator
# This script computes simple interest based on user input.
# Formula: SI = (P * R * T) / 100

echo "========================================="
echo "   Simple Interest Calculator"
echo "========================================="
echo ""

# Input: Principal
read -p "Enter the principal amount: " principal

# Input: Rate of Interest
read -p "Enter the rate of interest (per annum): " rate

# Input: Time Period
read -p "Enter the time period (in years): " time

# Calculate Simple Interest
simple_interest=$(echo "scale=2; ($principal * $rate * $time) / 100" | bc)

# Calculate Total Amount
total_amount=$(echo "scale=2; $principal + $simple_interest" | bc)

# Output
echo ""
echo "========================================="
echo "   Results"
echo "========================================="
echo "   Principal Amount  : $principal"
echo "   Rate of Interest  : $rate%"
echo "   Time Period       : $time year(s)"
echo "   Simple Interest   : $simple_interest"
echo "   Total Amount      : $total_amount"
echo "========================================="
