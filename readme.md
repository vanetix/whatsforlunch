# What's for lunch?
## Generates a lunch poll from a location/entity collection

# Day generation
- A new day is generated at the first request for a new day.
- *You could automate day generation with cron*

## Todo
- better random lunch algorithm?
- **tests**

# Api Methods
### Entity
- *Get* /entity/ - Returns all entities
- *Get* /entity/:id - Returns entity with id, :id
- *Post* /entity/ - Create new entity
- *Put* /entity/:id - Update entity with id, :id
- *Delete* /entity/:id - Delete entity with id, :id
 
### Day
- *Get* /day/ - Returns all days
- *Get* /day/:id - Returns day with id, :id
 
### Today
- *Get* /lunch/ - Returns the current poll for today
- *Put* /lunch/vote - Update the current day, data = entity({ id|name })
