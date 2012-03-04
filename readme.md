# What's for lunch?
## Generates some sweet lunch polls from an entity collection

###Bugs
- If the day changes while the server is up, it will continue to make new days


# Api Methods
## Entity
- *Get* /lunch/entity/ - Returns all entities
- *Get* /lunch/entity/:id - Returns entity with id, :id
- *Post* /lunch/entity/ - Create new entity
- *Put* /lunch/entity/:id - Update entity with id, :id
- *Delete* /lunch/entity/:id - Delete entity with id, :id

## Day
- *Get* /lunch/day/ - Returns all days
- *Get* /lunch/day/:id - Returns day with id, :id

## Today
- *Get* /lunch/ - Returns the current poll for today
- *Put* /lunch/vote - Update the current day, data = entity({ id|name })
