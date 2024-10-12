import pandas as pd
import os
from math import isclose

# Directory where fish CSV files are stored
input_dir = "csvs/fish_files"  # Replace with the directory where all fish CSVs are located
output_dir = "fish_groups"  # Directory where the final grouped CSV will be saved

# Ensure the output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Tolerance for latitude and longitude (±2)
lat_lon_tolerance = 2.0

# Function to check if two points are within the ±2 lat/lon tolerance
def within_tolerance(lat1, lon1, lat2, lon2, tol=lat_lon_tolerance):
    return isclose(lat1, lat2, abs_tol=tol) and isclose(lon1, lon2, abs_tol=tol)

# List to hold the combined grouped fish data from all files
all_grouped_data = []

# Loop through all CSV files in the input directory
for file_name in os.listdir(input_dir):
    if file_name.endswith(".csv"):
        file_path = os.path.join(input_dir, file_name)
        # Load the current fish CSV file
        df = pd.read_csv(file_path)
        
        # Keep track of used entries in this file
        used_indices = set()
        
        # Process and group the fish entries by proximity
        for i, row in df.iterrows():
            if i in used_indices:
                continue  # Skip if this row has already been used
            
            # Initialize a group with the current fish
            group = [i]
            current_lat, current_lon = row['Latitude'], row['Longitude']
            
            # Compare with all other entries in the file
            for j, other_row in df.iterrows():
                if j in used_indices or i == j:
                    continue  # Skip if already used or comparing the same entry
                
                other_lat, other_lon = other_row['Latitude'], other_row['Longitude']
                
                # Check if the other entry is within ±2 lat/lon of the current entry
                if within_tolerance(current_lat, current_lon, other_lat, other_lon):
                    group.append(j)  # Add to the current group
            
            # Mark all indices in this group as used
            used_indices.update(group)
            
            # Calculate the average latitude and longitude for the group
            group_lats = df.loc[group, 'Latitude']
            group_lons = df.loc[group, 'Longitude']
            avg_lat = group_lats.mean()
            avg_lon = group_lons.mean()

            # Append the grouped data [number of fishes, fish name, avg_lat, avg_lon]
            all_grouped_data.append([len(group), row['Common Name'], avg_lat, avg_lon])

# Create a DataFrame for the combined grouped data
combined_grouped_df = pd.DataFrame(all_grouped_data, columns=['Number of Fishes', 'Name', 'Average Latitude', 'Average Longitude'])

# Save the combined data to a single CSV file
output_file = os.path.join(output_dir, "combined_grouped_fish.csv")
combined_grouped_df.to_csv(output_file, index=False)

print(f"Combined grouped CSV file created at {output_file}!")
