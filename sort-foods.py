import json

with open('public/foods.json', 'r') as f:
  foods = json.load(f)

foods.sort(key=lambda x: x['name'] + x['subtitle'] if 'subtitle' in x else x['name'])

with open('public/foods.json', 'w') as f:
  json.dump(foods, f, indent=2)

print("foods.json has been sorted by ID in ascending order")