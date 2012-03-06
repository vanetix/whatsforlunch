# Interface with whatsforlunch api from hubot
#
# lunch-locations - get all lunch locations
# lunch-locations add - add a location for lunch
# lunch-locations delete - delete the specific lunch location
#
# lunch-today - get the current choices for today
# lunch-vote <id | name> vote on the current locations
#
# what's for lunch? - get the highest rated location for today
#

LUNCH_SERVER = process.env.LUNCH_SERVER


module.exports = (robot) ->

  robot.respond /(lunch-today|lunch-locations)$/i, (msg) ->
    if msg.match[1] is 'lunch-locations'
      locationDispatcher msg, 'get'
      return
    else
      todayDispatcher msg

  robot.respond /lunch-locations(?:\s+)(delete|add)(?:\s)([a-z A-Z0-9]+)$/i, (msg) ->
    if msg.match[1] is 'add'
      locationDispatcher msg, 'post'
      return
    else
      locationDispatcher msg, 'delete'
      return

  robot.respond /lunch-vote(?:\s+)([a-z A-Z0-9]+)/i, (msg) ->
    voteDispatcher msg

  robot.hear /(what'?s?(?:\s*)for(?:\s*)lunch|i'?m hungry)/i, (msg) ->
    todayDispatcher msg, true


#GET/POST/DELETE - Basically a controller for entities
locationDispatcher = (msg, method) ->
  url = LUNCH_SERVER + '/entity/'

  if method is 'get'
    msg.http(url)
        .get() (err, res, body) ->
          if res.statusCode isnt 200
            msg.send "Error retrieving locations from #{url}"
            return
          else
            locations = JSON.parse body
            msg.send 'Locations:'
            locations.forEach (location) ->
              msg.send "#{location._id} - #{location.name}"
            return

  if method is 'post'
    data = JSON.stringify({ name: msg.match[2] })
    msg
      .http(url)
      .headers('Content-Type': 'application/json')
      .post(data) (err, res, body) ->
        if res.statusCode isnt 201
          error = JSON.parse body
          msg.send "Unable to create location: #{error.error}"
          return
        else
          location = JSON.parse body
          msg.send "Location created:"
          msg.send "#{location._id} - #{location.name}"
          return

  if method is 'delete'
    if isNaN msg.match[2]
      msg.send "Invalid id for deleting a location"
      return
    msg
      .http(url + msg.match[2])
      .delete() (err, res, body) ->
        if res.statusCode isnt 200
          error = JSON.parse body
          msg.send "Unable to delete location: #{error.error}"
          return
        else
          msg.send "Successfully deleted #{msg.match[2]}"
          return


#POST SERVER/lunch/vote - { id|name, votee }
voteDispatcher = (msg) ->
  url = LUNCH_SERVER + '/lunch/vote'
  obj = {voter: msg.message.user.name}
  if isNaN msg.match[1]
    obj.name = msg.match[1]
  else
    obj.id = msg.match[1]
  msg
    .http(url)
    .headers('Content-Type': 'application/json')
    .put(JSON.stringify(obj)) (err, res, body) ->
      if res.statusCode isnt 200
        error = JSON.parse body
        msg.send "Error voting: #{error.error}"
        return
      else
        msg.send "Vote accepted"


#GET server/lunch/ -> prints all choices from the server
todayDispatcher = (msg, highest=false) ->
  url = LUNCH_SERVER + '/lunch/'
  msg
    .http(url)
    .headers(Accept: 'application/json')
    .get() (err, res, body) ->
      if res.statusCode isnt 200
        error = JSON.parse body
        msg.send "Error: #{error.error}"
        return
      else
        locations = JSON.parse(body).entities
        if not highest
          msg.send "Todays Locations:"
          locations.forEach (location) ->
            msg.send "#{location.id} - #{location.name}, Rating: #{location.rating}"
          return
        else
          ratings = (location.rating for location in locations)
          highest = ratings.indexOf(Math.max.apply Math, ratings)
          location = locations[highest]
          msg.send "Top location: #{location.id} - #{location.name}, Rating: #{location.rating}"
        return