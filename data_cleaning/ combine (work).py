import pandas as pd

# Read the CSV file
df = pd.read_csv('combined_output.csv')

# Drop rows where 3rd or 4th column is NaN or 0.0
# Adjust column indices based on the CSV structure
df_cleaned = df[~((df.iloc[:, 2].isna() | df.iloc[:, 2] == 0.0) | (df.iloc[:, 3].isna() | df.iloc[:, 3] == 0.0))]

# Save the cleaned data back to CSV
df_cleaned.to_csv('cleaned_file.csv', index=False)
