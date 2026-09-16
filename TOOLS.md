# Tools

Generated from [`tools.json`](tools.json) by `node scripts/render-tools.mjs`. Every tool is read-only and returns structured content matching its `outputSchema` in `tools.json`, plus the same JSON as text.

Quantities are SI with the unit in the field name (`durationS`, `distanceM`, `weightKg`, `avgPowerW`); dates like `2026-09-13` are days on the athlete's calendar; instants are ISO-8601 UTC.

## `get_today` — Today's session

The session Body Lab prescribes for today and tomorrow, with the reasons behind it (each citing the metric that drove it), alternatives in other sports, what's already been done today, sessions the athlete committed to, this morning's readiness, and the nearest A event's name, date, days until and taper/event-day/recovery phase, if one is set, and anything the athlete told Body Lab about today — being ill, sore or injured, short on time, or away from their equipment or sports, or the altitude they confirmed they're at today — which the session already respects, plus any return window after an illness or injury was cleared. Start here when the athlete asks what to do, whether to train or rest, why the plan says what it does, or how a race is affecting the plan. Endurance targets are heart-rate (bpm) and power (watts) ranges; strength sessions list sets, reps, weight (kg) and reps in reserve.

Scope: `training:read`

_No arguments._

## `get_week` — The week ahead

A projection of the next seven days, today first: for each day the kind of session (rest, easy, long/build, quality, strength), the sport and roughly how long, which day is the long one, when strength follows a session, planned volume cuts, and whether a taper, event day, post-event recovery or recovery week shapes it, with any illness or injury it assumes is still active. Today and tomorrow match get_today; later days are outlines with no targets. It is not a plan: each day is decided that morning from how training and recovery actually went, so always pass on the `note` and the assumptions. Use for 'what does my week look like', 'when's my long day', or planning around rest days and a race.

Scope: `training:read`

_No arguments._

## `get_weekly_review` — How the week went

A review of one finished week (Monday to Sunday on the athlete's calendar; only complete weeks). The sessions the athlete committed to (planned, exported or sent to a device) against what was done: as prescribed, differently (fewer intervals, less work at target, another sport), skipped, or done without a recording to measure, judged in the metric each workout targeted, with any illness, injury or short day that explains it. Where the acute:chronic ratio and chronic load sat and moved; the strength floor with the count; what the athlete reported. For the most recent week, also what changes in the next seven days and why, as a projection, and what the training so far supports for an A event in the next eight weeks, from rules Body Lab already applies, not a prediction. Omit `week` for the most recent week. Use for 'how did my week go', 'did I do what was planned' or 'am I on track for my race'. Pass the sentences on as written; they cite their numbers.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `week` | string (optional) | Any day in the week to review, e.g. from previousWeek. Omit for the most recent complete week. |

## `get_training_status` — Training status

Where the athlete's training stands: fitness (CTL), fatigue (ATL), form, acute:chronic workload ratio and ramp rate; monotony and strain; the easy/moderate/hard split; strength and impact frequency; readiness; the current training block; the nearest A event's name, days until and taper/event-day/recovery phase, if one is set — plus load, fitness and fatigue week by week across the window. Use for 'how's my training going', 'am I overdoing it', or comparing recent weeks.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today to cover. min 28, max 365, default 90 |

## `list_activities` — Activities

The athlete's activities, newest first, 25 per page: recorded and typed-in sessions and strength workouts, with sport, start time, duration (s), distance (m) and training load. Use get_activity with an id for the detail of one.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `page` | integer (optional) | min 1, max 200, default 1 |
| `type` | string (optional) | Only this sport. |

## `get_activity` — One activity

One activity in detail: duration, distance, elevation, heart rate, power, session RPE, notes, the training load and where it came from, time in each heart-rate zone, power bests (the best average watts over each duration within this activity; after intervals a longer duration's best can be higher than a shorter one's, because the longer window spans two efforts and the shorter can hold only one plus recovery), how it compared with the planned session (if there was one), and the strength sets logged against it.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `id` | string | An activity id from list_activities or get_today. |

## `get_recovery` — Recovery readings

Morning recovery readings by day, newest first: resting heart rate (bpm), overnight HRV (ms, RMSSD), sleep score and a device energy score (both 0–100). Days without readings are absent. Use for sleep, HRV or 'how recovered am I' questions; get_today already includes today's readiness verdict.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today. min 7, max 365, default 28 |

## `get_strength` — Strength training

The strength session Body Lab would prescribe now (exercises, sets, reps, weights in kg, reps in reserve, and why each weight moved or held), estimated one-rep maxes, and the most recent logged strength sessions set by set.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `recentSessions` | integer (optional) | How many recent sessions to include. min 1, max 20, default 5 |

## `get_profile` — Athlete profile

The athlete's profile: sports, strength equipment (which decides the exercises a strength session names), time zone, display units, heart-rate anchors (max, resting, threshold — each saying whether it was entered, estimated or observed), FTP, weight; dated test results (FTP, VO2max, threshold HR); and the power curve, recent and all-time.

Scope: `training:read`

_No arguments._

## `find_exercises` — Exercise catalogue

Body Lab's strength exercise catalogue, optionally filtered by a word in the name or by movement pattern (squat, hinge, lunge, horizontal_push, vertical_pull…).

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `query` | string (optional) | A word to match in the exercise name, e.g. 'squat'. |
| `movementPattern` | string (optional) |  |

## `suggest_routes` — Routes for today

Routes the athlete has done before that fit today's prescribed endurance sessions, grouped by start area and sport, with duration, distance, climbing, how often they've been done and why each fits. Only sports with a prescribed session today and a route history appear.

Scope: `training:read`

| Argument | Type | |
| --- | --- | --- |
| `modality` | string (optional) | Only this sport, e.g. road_biking or running. |

# Prompts

- **`todays-session`** — What should I do today?: Today's prescribed session, why Body Lab chose it, and the alternatives.
- **`weekly-review`** — Review my week: How the last week of training went against what was prescribed, and what changes next.

# Server instructions

```
Body Lab is the athlete's training app: it reads their training load and morning recovery signals and prescribes one session a day (endurance with heart-rate and power targets, or strength with sets, reps and weights), citing the metric behind each call.

- Body Lab's prescription and rationale are the source of truth for what the athlete should do; explain them rather than substituting your own plan, and say so when you disagree.
- Quantities are SI with the unit in the field name (durationS seconds, distanceM metres, weightKg, avgPowerW). Convert to the athlete's display units (`units`: metric or imperial) when talking to them.
- Dates like 2026-09-13 are days on the athlete's own calendar; instants are ISO-8601 UTC. get_today returns today's date and the athlete's time zone.
- Training load is on Body Lab's calibrated scale; CTL is fitness, ATL fatigue, form = CTL − ATL, ACWR the acute:chronic ratio.
- This is training guidance, not medical advice.
```
