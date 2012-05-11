# What's for lunch?
## Generates a lunch poll from a location/location collection

# Day generation
- A new day is generated at the first request for a new day.
- *You could automate day generation with cron*


## Todo
- locations are added to the current used set when they are voted the highest for the day
- **tests**



# Api Methods
### Entity
- *Get* /location/ - Returns all entities
- *Get* /location/:id - Returns location with id, :id
- *Post* /location/ - Create new location
- *Put* /location/:id - Update location with id, :id - only allows the update of weighs for a location
- *Delete* /location/:id - Delete location with id, :id

### Day
- *Get* /day/ - Returns all days
- *Get* /day/:id - Returns day with id, :id

### Today
- *Get* /day/today - Returns the current poll for today
- *Put* /day/vote - Update the current day, data = location({ id|name })
