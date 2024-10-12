import pandas as pd
import os
from math import isclose

# Define proximity tolerance for latitude and longitude (±2)
lat_lon_tolerance = 5.0

# Function to check if two points are within the ±2 lat/lon tolerance
def within_tolerance(lat1, lon1, lat2, lon2, tol=lat_lon_tolerance):
    return isclose(lat1, lat2, abs_tol=tol) and isclose(lon1, lon2, abs_tol=tol)

# Process each CSV file in the folder
def process_fish_files(input_folder, output_folder, lat_lon_tolerance=2.0):
    # Ensure the output directory exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Get all CSV files in the input folder
    csv_files = [f for f in os.listdir(input_folder) if f.endswith('.csv')]
    
    for csv_file in csv_files:
        # Load the current CSV file
        input_file = os.path.join(input_folder, csv_file)
        df = pd.read_csv(input_file)
        
        # List to hold grouped fish data
        grouped_data = []

        # Iterate over the data to group the fish
        used_indices = set()  # To track used fish entries
        for i, row in df.iterrows():
            if i in used_indices:
                continue  # Skip if this row has already been used

            # Initialize a group with the current fish
            group = [i]
            current_lat, current_lon = row['Latitude'], row['Longitude']

            # Compare with all other entries
            for j, other_row in df.iterrows():
                if j in used_indices or i == j:
                    continue  # Skip if already used or comparing the same entry

                other_lat, other_lon = other_row['Latitude'], other_row['Longitude']

                # Check if the other entry is within ±2 lat/lon of the current entry
                if within_tolerance(current_lat, current_lon, other_lat, other_lon, lat_lon_tolerance):
                    group.append(j)  # Add to the current group

            # Mark all indices in this group as used
            used_indices.update(group)

            # Calculate the average latitude and longitude for the group
            group_lats = df.loc[group, 'Latitude']
            group_lons = df.loc[group, 'Longitude']
            avg_lat = group_lats.mean()
            avg_lon = group_lons.mean()

            # Append the grouped data [number of fishes, fish name, avg_lat, avg_lon]
            grouped_data.append([len(group), row['Common Name'], avg_lat, avg_lon])

        # Create a DataFrame for the grouped data
        grouped_df = pd.DataFrame(grouped_data, columns=['Number of Fishes', 'Name', 'Average Latitude', 'Average Longitude'])

        # Save to a new CSV file in the output directory
        output_file = os.path.join(output_folder, f"grouped_{csv_file}")
        grouped_df.to_csv(output_file, index=False)

        print(f"Grouped CSV file created for {csv_file} at {output_file}!")

# Define the input folder containing the original CSV files
input_folder = "csvs/fish_files"  # Replace with your input folder
# Define the output folder to store the grouped CSVs
output_folder = "grouped_fish_files"

# Run the fish processing function
process_fish_files(input_folder, output_folder)
