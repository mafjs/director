# maf-director 0.x API

## Director

### `constructor (logger)`

- `logger` - Logger. Required.


### `head`

Director Head instance

see [DirectorHead](#directorhead)

### `addJob (name, handler)`

- `name` - String. Required. Uniq job name
- `handler` - Function. Required. Job function, should return `Promise`

return `this`

### `addJobs (jobs)`

- `jobs` - Object. Required

return `this`


### `setPlanType (type, [options])`

default plan type PLAN.SEQUENTIAL

- `type` - String. Required. See [Plan Types](#plan-types)

return `this`

### `setPlan (plan)`

- `plan` - Array. Required. Execution plan

return `this`

### `run ()`

return `Promise`


## `DirectorHead`

### `set (name, value)`

### `get (name)`


## Plan Types

### `Director.PLAN.SEQUENTIAL`

### `Director.PLAN.QUEUE`
