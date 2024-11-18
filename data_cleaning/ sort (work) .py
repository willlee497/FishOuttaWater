import pandas as pd
import os

# Load the CSV file
input_file = "sorted_file copy.csv"  # Replace with your file name
df = pd.read_csv(input_file)

# Ensure the output directory exists
output_dir = "csvs/fish_files"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Group by fish name and save each group to a separate CSV file
for fish_name, group in df.groupby('Common Name'):
    output_file = os.path.join(output_dir, f"{fish_name}.csv")
    group.to_csv(output_file, index=False)

print("CSV files created for each fish!")
