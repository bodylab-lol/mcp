# Tools

Generated from [`tools.json`](tools.json) by `node scripts/render-tools.mjs`. Every tool returns structured content matching its `outputSchema` in `tools.json`, plus the same JSON as text. Every tool is read-only except where it says it writes, and a tool is only available when the athlete allowed its scope.

Quantities are SI with the unit in the field name (`durationS`, `distanceM`, `weightKg`, `avgPowerW`); dates like `2026-09-13` are days on the athlete's calendar; instants are ISO-8601 UTC.

## `get_today` — Today's session

The session Body Lab prescribes for today and tomorrow, with the reasons behind each (citing the metric that drove it) and alternatives in other sports; what's already been done today, sessions the athlete committed to, this morning's readiness; the races and goals still to come, the event the plan is built around or today's event at any priority, and the preparation phase the run-up is in — Base, Build, Specific (often called Peak) or Taper, an emphasis recomputed each morning, not a plan; and anything the athlete told Body Lab about today — being ill, sore or injured, short on time, away from their equipment or sports, or today's altitude — which the session already respects, plus any return window after a cleared one. Start here when the athlete asks what to do, whether to train or rest, why the plan says what it does, or how a race affects it. Endurance targets are heart-rate (bpm) and power (watts) ranges; strength lists sets, reps, weight (kg) and reps in reserve.

Scope: `training:read`. Read-only.

_No arguments._

## `set_today_context` — Tell Body Lab about today

Tells Body Lab what today actually looks like for the athlete — how many minutes they have, which strength equipment is to hand, which sports are out — and returns the session Body Lab prescribes once it knows. Use it when the athlete pushes back with a constraint, instead of shortening the session yourself: the engine re-prescribes, and its answer is the one to give them. Only the fields you pass change; anything the athlete set in Body Lab today is read first and kept. Today only, on their own calendar — it's gone tomorrow, they can change it on Body Lab's Today screen, and nothing in their training history is touched. It can't record an illness or an injury and refuses to try: deciding that someone is ill, or that a sore knee is an injury, is a health judgement, and the athlete reports that themselves in the app. Check with the athlete before calling, then read the `report` it returns back to them before today's session — that's what was recorded, not what was asked for.

Scope: `today:write`. Writes: can change or take back something already there, and the same call again lands on the same state, so a retry is safe. It never deletes anything, and never touches your training history.

| Argument | Type | |
| --- | --- | --- |
| `timeAvailableMin` | integer or null (optional) | Minutes the athlete has for training today, 10 to 600. The session is shortened to fit. Null clears it; leave it out to keep what Body Lab already has. |
| `equipment` | string or null (optional) | The strength equipment to hand today, when it isn't the athlete's usual. It decides which exercises a strength session can name: a rung named for today wins outright over the place the athlete is at, because "dumbbells only today" is the whole truth about today rather than their garage minus some things. Null hands today back to whichever place is in force; leave it out to keep what Body Lab already has. For a stay rather than a day, set_equipment_place is the tool — this is gone tomorrow. |
| `unavailableSports` | array (optional) | Sports the athlete can't do today — the pool is shut, the bike is in the shop. Body Lab prescribes around them. An empty array clears the list; leave it out to keep what Body Lab already has. at most 20 |

## `set_equipment_place` — Where the athlete is training

Says where the athlete is training, and gives back the session Body Lab prescribes once it knows. `place` switches to one of the places they named in Body Lab — their garage, a hotel gym — and holds until they switch again. `items` says they are somewhere different just for today: it reverts to their home place tomorrow and is never added to their list, so for somewhere they'll go back to, ask them to add it in Body Lab and switch to it by name after that. Use it for "I'm at a hotel this week, dumbbells up to 20 kg". Every session from now on is written from that kit, and it replaces anything set_today_context said about today's equipment, so check with the athlete first and read back the place and the session it returns — that is what was recorded. It can't name, rename or delete a place; they do that in Body Lab, with the list in front of them. Nothing in their training history changes, and calling it twice lands in one place rather than leaving two.

Scope: `equipment:write`. Writes: can change or take back something already there, and the same call again lands on the same state, so a retry is safe. It never deletes anything, and never touches your training history.

| Argument | Type | |
| --- | --- | --- |
| `place` | string (optional) | The name of a place the athlete already has (or its id) to switch to — get_today's `today.equipmentNote.placeName` says which one today was written for, and this tool's result lists them all. The switch holds until they switch again, so use it for a stay, not a one-off. Leave it out when giving `items`. |
| `items` | object (optional) | Somewhere different just for today, and only today: what is there, each item mapping to the heaviest single one of it in kilograms, or null for "enough" (a rack needs no number). Leave an item out and it isn't there; `{}` is a real answer — a hotel room with nothing in it. It reverts to the athlete's home place tomorrow and is never added to their list, so for somewhere they will go back to, ask them to add it in Body Lab and switch to it by name afterwards. Leave it out when giving `place`. |

## `get_week` — The week ahead

A projection of the next seven days, today first: for each day the kind of session (rest, easy, long/build, quality, strength), the sport and roughly how long, which day is the long one, when strength follows a session, planned volume cuts, and whether a taper, event day, post-event recovery or recovery week shapes it, with any illness or injury it assumes is still active. Each day carries its preparation phase too (Base, Build, Specific — often called Peak — or Taper): an emphasis recomputed each morning from the A event's date, not a plan. Today and tomorrow match get_today; later days are outlines with no targets. It is not a plan: each day is decided that morning from how training and recovery actually went, so always pass on the `note` and the assumptions. Use for 'what does my week look like', 'when's my long day', or planning around rest days and a race.

Scope: `training:read`. Read-only.

_No arguments._

## `schedule_session` — Put a session on the calendar

Puts a session the athlete has arranged on their calendar — a club ride, a run with a friend, a standing Tuesday group session — so Body Lab plans the week around it: the session is that day's session in its sport, and Body Lab prescribes nothing beside it. One entry per occurrence, dated on the athlete's own calendar (take today from get_today; never guess which Thursday); a weekly ride until December is one entry a week, twenty per call. Not for a race or a goal — that's schedule_event. Check the details with the athlete first, then read each entry's outcome back: an identical session already on that day is left as it is (already_scheduled, nothing written), and a refusal says why in words to pass on. Days within the coming week come back re-planned in `week`; later days are planned when they come into range, and `note` says which is which. Take one off again with withdraw_session. Nothing in the athlete's training history is touched.

Scope: `schedule:write`. Writes: can change or take back something already there, and the same call again lands on the same state, so a retry is safe. It never deletes anything, and never touches your training history.

| Argument | Type | |
| --- | --- | --- |
| `sessions` | array | One entry per occurrence, in the order to report them back. There is no recurrence: a weekly ride until December is one entry per week, at most 20 in a call. Each is stored on its own, so one refused entry doesn't lose the rest. at least 1, at most 20 |
| `sessions[].forDate` | string | The day it happens, on the athlete's own calendar, as YYYY-MM-DD. Take today from get_today and count from there rather than guessing which Thursday. Up to 180 days ahead; yesterday at the earliest. |
| `sessions[].sport` | string | The sport, e.g. road_biking, running, lap_swimming. Body Lab prescribes nothing beside a session in the same family that day. |
| `sessions[].durationS` | integer | How long the athlete expects it to take, in seconds (a two-hour ride is 7200). min 60, max 86400 |
| `sessions[].intensity` | string | How hard the athlete says it usually is. easy: steady aerobic, and the week may still put a hard day beside it. mixed: it has efforts in it. hard: it is the day's hard session. mixed and hard both make the day a hard one, which stops Body Lab prescribing a second hard day next to it. |
| `sessions[].name` | string (optional) | What the athlete calls it — "Club ride", "Run with Sam" — so they recognise it on the week. Defaults to the sport's own name. |

## `withdraw_session` — Take a session off the calendar

Takes a session the athlete arranged off their calendar — the ride is called off, the friend cancelled — so Body Lab stops planning around it and the weekly review stops expecting it. Name the day (on the athlete's own calendar, from get_today) and, when the day holds more than one session, the sport or the id; a day with two rides is refused with both listed rather than guessed at. The session is kept and marked withdrawn, never deleted: that the athlete meant to train and then didn't is a fact about the week. Withdrawing one already withdrawn changes nothing and succeeds, and says so. It takes a strength routine off too: its day and sport strength_training. Only sessions the athlete arranged can be withdrawn — never a session Body Lab prescribed, an activity, or anything in training history. Check with the athlete before calling, then give them the day as Body Lab now plans it when it comes back in `day`.

Scope: `schedule:write`. Writes: can change or take back something already there, and the same call again lands on the same state, so a retry is safe. It never deletes anything, and never touches your training history.

| Argument | Type | |
| --- | --- | --- |
| `forDate` | string | The day of the session, on the athlete's own calendar (get_today says what today is there). |
| `sport` | string (optional) | Narrows to that sport, for a day holding more than one session. |
| `id` | string (optional) | The session's id, from schedule_session's result or from a refusal that listed the day's sessions. Needed only when the day and sport still name more than one. |

## `schedule_strength_routine` — Put a strength routine on the calendar

Puts strength routines the athlete has chosen — a program's upper and lower days, a session a coach wrote — on their calendar, run and logged in Body Lab's strength runner. Call find_exercises first and use its ids. Write each routine once in `routines` and date it in `occurrences`, one per day, twenty per call (take today from get_today). Read each routine back to the athlete before calling. weightKg is kilograms of total load, the bar or both dumbbells included; leave it out and Body Lab fills it on the day from the athlete's own lifting. A stated weight is stored as given, and one far above what they've logged is flagged to them in the app. A routine alone is that day's session; for a lift plus a ride or run on one date, add those with schedule_session. Each occurrence comes back scheduled, already_scheduled (identical, nothing written) or refused with a reason to pass on — an unknown exercise with suggestions to ask about. Take one off with withdraw_session.

Scope: `schedule:write`. Writes: can change or take back something already there, and the same call again lands on the same state, so a retry is safe. It never deletes anything, and never touches your training history.

| Argument | Type | |
| --- | --- | --- |
| `routines` | array | Each routine once, by name: up to 6. Weeks 1–4 at 3×8 and weeks 5–8 at 4×6 are two routines. at least 1, at most 6 |
| `routines[].name` | string | What the athlete calls the session — "Upper A", "Week 3, day 2" — so they recognise it on the week. Unique within the call: occurrences name it. |
| `routines[].durationS` | integer (optional) | How long it takes, in seconds (an hour is 3600). Left out, Body Lab estimates it from the sets, reps and rests. min 600, max 14400 |
| `routines[].exercises` | array | In the order they're done. Each exerciseId comes from find_exercises. weightKg is kilograms of total load (the bar, or both dumbbells, included); leave it out to have Body Lab fill it on the day from the athlete's own lifting, from percentOfMax or rir. At most 60 sets in a routine. at least 1, at most 20 |
| `routines[].exercises[].exerciseId` | string | A catalogue id from `GET /exercises`. Nothing is created from a name: an id the catalogue doesn't hold refuses the routine with UNKNOWN_EXERCISE and suggestions to choose from. |
| `routines[].exercises[].name` | string (optional) | What the program calls the exercise, as free text. Used only to suggest catalogue ids when `exerciseId` is unknown, and kept with that refusal so Body Lab can see which exercises people are missing. Never stored with the routine and never shown as its name. |
| `routines[].exercises[].sets` | integer | min 1, max 10 |
| `routines[].exercises[].reps` | integer | Reps (1–100), or seconds (1–600) for an exercise counted in seconds. Per side for a unilateral exercise. min 1, max 600 |
| `routines[].exercises[].unit` | string (optional) | Defaults to the exercise's own `defaultUnit`, and must match it when given (UNIT_MISMATCH): a plank is held for seconds and a squat counted in reps. |
| `routines[].exercises[].weightKg` | number or null (optional) | The total load in kilograms, including the bar or both dumbbells — never one implement or one side of the bar, and never pounds. Negative is assistance, only for an exercise that allows it. Leave it out to let Body Lab fill a weight on the day from the athlete's own lifting (`percentOfMax`, or `rir` alone). Not with `percentOfMax`. |
| `routines[].exercises[].percentOfMax` | number (optional) | A share of the athlete's estimated one-rep max, 0.3–1.0, turned into a weight on the day. Not with `weightKg`. min 0.3, max 1 |
| `routines[].exercises[].rir` | number (optional) | Reps in reserve to stop at. RPE 8 is rir 2. min 0, max 5 |
| `routines[].exercises[].restS` | integer (optional) | Rest between this exercise's sets. Left out, Body Lab rests it as it rests its own sessions. min 0, max 600 |
| `routines[].exercises[].supersetGroup` | string (optional) | Exercises sharing a letter alternate, in array order. |
| `routines[].exercises[].cue` | string (optional) | A short coaching cue, shown as written and attributed to whoever scheduled the routine, never as Body Lab's own words. |
| `occurrences` | array | One entry per day a routine is done, in the order to report them back, at most 20 in a call. There is no recurrence: Monday and Thursday for eight weeks is sixteen entries. Each is stored on its own, so one refused date doesn't lose the rest. at least 1, at most 20 |
| `occurrences[].forDate` | string | The day, on the athlete's own calendar, as YYYY-MM-DD. Take today from get_today and count from there rather than guessing which Monday. Up to 180 days ahead; yesterday at the earliest. |
| `occurrences[].routine` | string | The name of one of `routines`. |

## `list_strength_routines` — Strength routines on the calendar

The strength routines on the athlete's calendar over up to 60 days (by default the next four weeks from today), each with its exercises in order — sets, reps (per leg or side where marked), rest, cues and weights as stated. A weight left to Body Lab is null here and filled on the day from the athlete's own lifting; get_today shows today's with the weight filled. Lists routines the athlete added and any app added (`scheduledBy`). Use for "what's in Thursday's gym session" or to check a program before changing it. get_week shows the coming seven days as Body Lab plans them.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `from` |  (optional) | The first day, on the athlete's calendar. Defaults to today. |
| `to` |  (optional) | The last day, at most 60 days in all. Defaults to four weeks from `from`. |
| `includeWithdrawn` | boolean (optional) | Also list routines taken off the calendar, each with `withdrawnAt` set. default false |

## `schedule_event` — Add a race or goal

Adds a race or a goal the athlete has entered — a marathon in April, a gran fondo — at priority B or C, so it sits on their calendar, its date becomes an event day, and nearby days lean toward its sport. It can't add an A event and refuses to: an A event is the one the plan is built around — preparation phases, volume tapering in, a protected recovery window after — which is months of training restructured, so the athlete promotes an event to A themselves in Body Lab, where the screen shows what changes. Always tell them that's where to do it. Not for a session they've arranged: a weekly club ride entered as events would keep Body Lab leaning toward that sport for good — that's schedule_session. Check get_today's `events` first and read the name, date and sport back to the athlete before calling: calling twice adds two, and only the athlete can edit or remove one, in Body Lab.

Scope: `events:write`. Writes: adds data, and can't change or delete it. The same call again adds again.

| Argument | Type | |
| --- | --- | --- |
| `name` | string | The event's name as the athlete knows it: "Boulder Marathon". |
| `eventDate` | string | The day of the event, on the athlete's own calendar, as YYYY-MM-DD. Up to 800 days ahead; yesterday at the earliest. |
| `sport` | string | The event's sport, e.g. running, road_biking, triathlon. Nearby days lean toward it. |
| `priority` | string | B or C, which behave identically: the event sits on the calendar, its date is an event day, and nearby days tilt toward its sport. A is refused — an A event rebuilds months of the plan, and the athlete promotes an event to A themselves in Body Lab. |
| `distanceM` | number or null (optional) | The distance in metres, if the athlete gave one (a marathon is 42195). |
| `durationS` | integer or null (optional) | The expected duration in seconds, if the athlete gave one. |
| `notes` | string (optional) | Anything the athlete said about it worth keeping with the entry. |

## `remove_event` — Take a race off the calendar

Removes a race or goal this assistant added — the athlete isn't doing it after all. It can only remove what it added itself: a race the athlete entered in Body Lab is theirs, and it says so rather than removing it. It can't remove an A race at all, even one it added that the athlete has since promoted, because the plan is built around that date — preparation, a taper into it, a protected week after — and only the athlete can take that decision back, in Body Lab. Removing is permanent and there is no undo, so read the race's name and date back to the athlete and get a yes before calling. Use get_today's `events` for the id.

Scope: `events:write`. Writes: adds data, and can't change or delete it. The same call again adds again.

| Argument | Type | |
| --- | --- | --- |
| `eventId` | string | The event to remove, from get_today's `events` or the id schedule_event returned. |

## `get_weekly_review` — How the week went

A review of one finished week (Monday to Sunday on the athlete's calendar; only complete weeks). The sessions the athlete committed to (planned, exported or sent to a device) against what was done: as prescribed, differently (fewer intervals, less work at target, another sport), skipped, done without a recording, or no_data (nothing could reach Body Lab that day, so never a skip), judged in the metric each workout targeted, with any illness, injury or short day that explains it. Where the acute:chronic ratio and chronic load sat and moved; the strength floor with the count; what the athlete reported. For the most recent week, also what changes in the next seven days and why, as a projection, and what the training so far supports for an A event in the next eight weeks, from rules Body Lab already applies, not a prediction. Omit `week` for the most recent week. Use for 'how did my week go', 'did I do what was planned' or 'am I on track for my race'. Pass the sentences on as written; they cite their numbers.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `week` | string (optional) | Any day in the week to review, e.g. from previousWeek. Omit for the most recent complete week. |

## `get_progress` — What got better

What has improved lately and what has changed, across everything Body Lab records: FTP, mean-maximal power, VO₂max, threshold speed, chronic load, every lift's heaviest set, longest and farthest session per sport, body mass and composition, blood pressure, resting heart rate, HRV, and every blood marker. Lifts are weights actually lifted, never an estimated one-rep max. Each note had to clear a floor for its metric, so measurement noise is never reported as a result. Use for 'what's improved?' or 'any PRs lately?'. The `improvement` flag decides your tone: where it is true the athlete trained for that number to move and you may say so. Where it is false Body Lab asserts no better direction — that covers body mass, body composition, blood pressure, resting heart rate, HRV, threshold heart rate and every blood marker — so report the change and add no praise, no concern and no health reading. A smaller body mass or a lower blood marker is a change, not good news. Pass the sentences on as written.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `sinceDays` | integer (optional) | How far back a reading still counts as news. Defaults to 90 days, which is short enough to be current and long enough to contain a blood draw or a scan. min 1, max 400 |
| `limit` | integer (optional) | How many notes at most. Defaults to 24, best first. min 1, max 100 |

## `get_training_status` — Training status

Where the athlete's training stands: fitness (CTL), fatigue (ATL), form, acute:chronic workload ratio and ramp rate; monotony and strain, with the athlete's own strain high and whether this week is above it; the easy/moderate/hard split; strength and impact frequency; readiness; the current training block; the event the plan is built around, if one is set — its name, days until, and whether the day sits in its taper or the recovery window after it, or is the day of an event at any priority — and the preparation phase the run-up to it is in (Base, Build, Specific — often called Peak — or Taper), which is an emphasis worked out daily from the event's date rather than a plan — plus load, fitness and fatigue week by week across the window. Use for 'how's my training going', 'am I overdoing it', or comparing recent weeks.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today to cover. min 28, max 365, default 90 |

## `list_activities` — Activities

The athlete's activities, newest first, 25 per page: recorded and typed-in sessions and strength workouts, with sport, start time, duration (s), distance (m) and training load. For a question about a particular span — last week, a month, the day of a race — give `from` and `to` rather than paging back to it. Use get_activity with an id for the detail of one.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `page` | integer (optional) | min 1, max 200, default 1 |
| `type` | string (optional) | Only this sport. |
| `from` |  (optional) | Only activities on or after this day, on the athlete's own calendar (get_today says what today is there). |
| `to` |  (optional) | Only activities on or before this day, inclusive. |

## `get_activity` — One activity

One activity in detail: duration, distance, elevation, heart rate, power, session RPE, notes, the training load and where it came from, time in each heart-rate zone, power bests (the best average watts over each duration within this activity; after intervals a longer duration's best can be higher than a shorter one's, because the longer window spans two efforts and the shorter can hold only one plus recovery), how it compared with the planned session (if there was one), and the strength sets logged against it.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `id` | string | An activity id from list_activities or get_today. |

## `get_recovery` — Recovery readings

Morning recovery readings by day, newest first: resting heart rate (bpm), overnight HRV (ms, RMSSD), sleep score and a device energy score (both 0–100). Days without readings are absent. Use for sleep, HRV or 'how recovered am I' questions; get_today already includes today's readiness verdict.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today. min 7, max 365, default 28 |

## `get_daily_steps` — Daily steps

Steps counted each day, newest first, with the source each count came from, and the mean of the last seven complete days. Use for 'how much have I moved outside training lately?'. Each day is one source's count, never several devices added together; days without a count are absent, not zero. Today's count is marked partial and is only so far. A whoop count runs wake to wake and is dated by the cycle's start. Recorded sessions' steps are inside these totals, and nothing in Body Lab's prescription reads steps.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today. min 7, max 365, default 30 |

## `get_strength` — Strength training

The strength session Body Lab would prescribe now (exercises, sets, reps, weights in kg, reps in reserve, and why each weight moved or held); the most recent logged sessions, exercise by exercise in `exercises` (`sets` is the same sets flat, and can be ignored); and `trend`, the heaviest working set of each session per lift over the past year with the heaviest ever recorded. Every number in `trend` is a weight the athlete actually lifted: nothing is estimated there, and it must not be presented as a one-rep max. The template's `oneRepMaxes` are the opposite — estimates, which account for reps left in reserve and are usually higher than anything the athlete has lifted — so quote `trend` for 'what's my best squat' and never the estimate. Give `lift` to ask about one exercise. Use for 'how's my lifting going', 'is my deadlift moving', or what today's session would be.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `recentSessions` | integer (optional) | How many recent sessions to include. min 1, max 20, default 5 |
| `lift` | string (optional) | Narrow `trend` to one exercise: its id, or a word from its name (e.g. 'squat'). Omit for the most-trained lifts. |
| `includeWarmups` | boolean (optional) | Include warm-up sets in each session's `exercises`. Off by default: they say nothing about what the athlete can lift. The flat `sets` always carries them, each marked. default false |

## `get_profile` — Athlete profile

The athlete's profile: sports, strength equipment (which decides the exercises a strength session names), training focus (endurance, or strength as much as endurance, which sets the strength floor at two or three sessions a week), whether the athlete has left jumps out of strength sessions, time zone, display units, heart-rate anchors (max, resting, threshold — each saying whether it was entered, estimated or observed), FTP, weight, and the athlete's most recent blood pressure in millimetres of mercury; dated test results (FTP, VO2max, threshold HR); and the power curve, recent and all-time. Blood pressure is two numbers from one reading, systolic over diastolic. Read them back as measurements and nothing else: don't call a value healthy, ideal, high or low, don't name a category or a threshold, and don't compare the athlete with anyone. Body Lab can't diagnose anything, a blood pressure never changes the training it prescribes, and questions about it go to a clinician.

Scope: `training:read`. Read-only.

_No arguments._

## `find_exercises` — Exercise catalogue

Body Lab's strength exercise catalogue: each exercise's id, name and other names ("OHP", "RDL"), movement pattern, the muscles it's chosen for, what equipment it needs and what can load it, whether reps are per side, and whether it's counted in reps or seconds. Filter by words matched against names and other names, by movement pattern (squat, hinge, lunge, horizontal_push, vertical_pull…) or by muscle. Use it before schedule_strength_routine: a routine names exercises by these ids, and nothing is created from a name.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `query` | string (optional) | Words matched against each exercise's name and other names — 'squat', 'rdl', 'skull crusher', 'pushup'. Every word must match, whole or as the start of a word ('sq', 'dumbb'); plurals find singulars. Exact names rank first, then whole words, then prefixes. |
| `movementPattern` | string (optional) |  |
| `muscle` | string (optional) | Only exercises chosen for this muscle group: biceps, triceps, delts, chest, lats, upper_back, quads, hamstrings, glutes, adductors, calves, trunk. |

## `suggest_routes` — Routes for today

Routes the athlete has done before that fit today's prescribed endurance sessions, grouped by start area and sport, with duration, distance, climbing, how often they've been done and why each fits. Without `modality` it covers today's likeliest sports — the prescribed session and its nearest alternatives — so name a sport to be sure of that one. Only sports with a prescribed session today and a route history appear.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `modality` | string (optional) | Only this sport, e.g. road_biking or running. |

## `get_lab_results` — Lab results

The athlete's blood test results as entered from lab reports. Each marker over time: every value, the latest against the lab's range and flag and any guideline limit (naming its source and population), whether the change since the last comparable draw is beyond the marker's normal variation, and how loudly to raise it (`tier`, `message`). Pass `message` on word for word, and never call a value safe, healthy or optimal. Lab results never change the training Body Lab prescribes, and this isn't a diagnosis. Use for 'how's my ferritin' or 'what did my last blood test show' — the markers answer both. The draws come too: the same values again as each report printed them, with the lab, the date and the conditions that decide whether two draws compare, which is what to check before recording more. Pass include: markers to leave them out when the markers are all you need.

Scope: `labs:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `marker` | string (optional) | Only this marker's key (e.g. ferritin, ldl_c), and only draws that include it. Omit for everything. |
| `include` | string (optional) | markers_and_draws (the default): each marker over time, plus the draws they came from. markers: the markers alone, which is still every value the athlete has, and about half the response. default "markers_and_draws" |

## `record_lab_results` — Record lab results

Records one blood draw and its results from a lab report the athlete gives you (a PDF, a photo, or values they type), exactly as printed. Before calling, read every marker, value, unit and range back to the athlete and get their yes: this can't edit or delete anything afterwards; only the athlete can, in Body Lab on the web. One call per draw date. Use `marker` keys from the list in its description; for a marker not listed, leave `marker` out and give `name` as printed. It's all or nothing: if any result is refused (an unknown key, a unit Body Lab doesn't recognise for that marker, a marker already recorded for a draw on that date, a range whose ends are reversed) nothing is saved, and the error lists each problem so you can fix it and call again. Returns the draw as saved.

Scope: `labs:write`. Writes: adds data, and can't change or delete it. The same call again adds again.

| Argument | Type | |
| --- | --- | --- |
| `localDate` | string | The day the blood was drawn (collected) on the athlete's calendar, YYYY-MM-DD — not the day the report was issued. |
| `collectedTime` | string or null (optional) | The collection time, HH:MM on the athlete's clock. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `labName` | string or null (optional) | The lab's name, as the report prints it. default null |
| `fastingHours` | number or null (optional) | Hours since the athlete last ate before the draw. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `recentIllness` | boolean or null (optional) | Whether the athlete was ill in the days before. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `ironSupplement10d` | boolean or null (optional) | Iron by mouth or infusion in the 10 days before. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `biotin` | boolean or null (optional) | Biotin taken before the draw. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `creatine` | boolean or null (optional) | Creatine taken before the draw. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `hormoneMedication` | boolean or null (optional) | Thyroid or sex-hormone medication, hormonal contraception included. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `menstruating` | boolean or null (optional) | true: has a current menstrual cycle; false: no current cycle. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `cycleDay` | integer or null (optional) | Day of the cycle, only with menstruating true. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `altitudeM` | number or null (optional) | The altitude the athlete lived at, metres. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `results` | array | Every result on the report to record, each once. at least 1, at most 100 |
| `results[].marker` | string (optional) | Body Lab's key for the marker. Known keys, each with the units Body Lab recognises for it (µ may be written u, and µg mcg): ferritin (Ferritin): ng/mL, µg/L; iron (Iron (serum)): µg/dL, µmol/L; transferrin (Transferrin): mg/dL, g/L; tibc (Total iron-binding capacity (TIBC)): µg/dL, µmol/L; transferrin_saturation (Transferrin saturation): %; haemoglobin (Haemoglobin): g/dL, g/L; haematocrit (Haematocrit): %, L/L; red_cells (Red blood cells): 10^6/µL, 10^12/L; mcv (Mean cell volume (MCV)): fL; mch (Mean cell haemoglobin (MCH)): pg; mchc (Mean cell haemoglobin concentration (MCHC)): g/dL, g/L; white_cells (White blood cells): 10^3/µL, 10^9/L; platelets (Platelets): 10^3/µL, 10^9/L; rdw (Red cell distribution width (RDW)): %; mpv (Mean platelet volume (MPV)): fL; neutrophils_pct (Neutrophils (%)): %; neutrophils_abs (Neutrophils (absolute)): 10^3/µL, 10^9/L, cells/µL; lymphocytes_pct (Lymphocytes (%)): %; lymphocytes_abs (Lymphocytes (absolute)): 10^3/µL, 10^9/L, cells/µL; monocytes_pct (Monocytes (%)): %; monocytes_abs (Monocytes (absolute)): 10^3/µL, 10^9/L, cells/µL; eosinophils_pct (Eosinophils (%)): %; eosinophils_abs (Eosinophils (absolute)): 10^3/µL, 10^9/L, cells/µL; basophils_pct (Basophils (%)): %; basophils_abs (Basophils (absolute)): 10^3/µL, 10^9/L, cells/µL; immature_granulocytes_pct (Immature granulocytes (%)): %; immature_granulocytes_abs (Immature granulocytes (absolute)): 10^3/µL, 10^9/L, cells/µL; nrbc_pct (Nucleated red blood cells (%)): %, /100 WBC; nrbc_abs (Nucleated red blood cells (absolute)): 10^3/µL, 10^9/L, cells/µL; total_cholesterol (Total cholesterol): mg/dL, mmol/L; ldl_c (LDL cholesterol): mg/dL, mmol/L; hdl_c (HDL cholesterol): mg/dL, mmol/L; non_hdl_c (Non-HDL cholesterol): mg/dL, mmol/L; triglycerides (Triglycerides): mg/dL, mmol/L; vldl_c (VLDL cholesterol): mg/dL, mmol/L; chol_hdl_ratio (Cholesterol/HDL ratio): ratio; ldl_hdl_ratio (LDL/HDL ratio): ratio; chol_hdl_risk (Cholesterol/HDL risk): ratio; ldl_hdl_risk (LDL/HDL risk): ratio; apob (Apolipoprotein B (ApoB)): mg/dL, g/L; lpa (Lipoprotein(a)): mg/dL, nmol/L; hba1c (HbA1c): %, mmol/mol; glucose (Glucose): mg/dL, mmol/L; tsh (TSH): mIU/L, µIU/mL; free_t4 (Free T4): ng/dL, pmol/L; free_t3 (Free T3): pg/mL, pmol/L; testosterone (Testosterone (total)): ng/dL, nmol/L; free_testosterone (Free testosterone): pg/mL, pmol/L; shbg (SHBG): nmol/L; oestradiol (Oestradiol): pg/mL, pmol/L; cortisol (Cortisol): µg/dL, nmol/L; insulin (Insulin): µIU/mL, pmol/L; creatinine (Creatinine): mg/dL, µmol/L; egfr (eGFR): mL/min/1.73m²; urea_nitrogen (Urea nitrogen (BUN)): mg/dL, mmol/L; cystatin_c (Cystatin C): mg/L; alt (ALT): U/L; ast (AST): U/L; ggt (GGT): U/L; ck (Creatine kinase (CK)): U/L; alp (Alkaline phosphatase (ALP)): U/L, IU/L; total_bilirubin (Total bilirubin): mg/dL, µmol/L; total_protein (Total protein): g/dL, g/L; albumin (Albumin): g/dL, g/L; sodium (Sodium): mmol/L, mEq/L; potassium (Potassium): mmol/L, mEq/L; chloride (Chloride): mmol/L, mEq/L; total_co2 (Carbon dioxide, total (CO2)): mmol/L, mEq/L; anion_gap (Anion gap): mmol/L, mEq/L; calcium (Calcium): mg/dL, mmol/L; hs_crp (hs-CRP): mg/L, mg/dL; crp (CRP): mg/L, mg/dL; vitamin_d (Vitamin D (25-OH)): ng/mL, nmol/L; vitamin_b12 (Vitamin B12): pg/mL, pmol/L; folate (Folate): ng/mL, nmol/L; magnesium (Magnesium (serum)): mg/dL, mmol/L; omega3_index (Omega-3 index): %. A ratio and the "risk" line a report prints beside it are separate markers, each recorded as printed. For a marker not on this list, leave marker out and give `name`. |
| `results[].name` | string (optional) | The marker's name exactly as the report prints it. Needed only when `marker` is left out; a name that matches a known marker is recorded as that marker. |
| `results[].value` | number | The number as printed, without any "<" or ">": 0.5 for "<0.5". |
| `results[].comparator` | string or null (optional) | For a result printed like "<0.5" or ">=90": the sign. Leave out for a plain number. default null |
| `results[].unit` | string | The unit exactly as the report prints it. For a ratio, or the "risk" line beside one, printed without a unit: "ratio". |
| `results[].rangeLow` | number or null (optional) | The low end of the lab's own reference range, as printed. Leave out if the report gives none. default null |
| `results[].rangeHigh` | number or null (optional) | The high end of the lab's reference range, as printed. default null |
| `results[].rangeText` | string or null (optional) | The range as printed when it isn't two numbers, e.g. "<200" or "Negative". default null |
| `results[].labFlag` | string or null (optional) | The flag the lab printed beside the result (H, L, critical, …), if any. default null |
| `results[].method` | string or null (optional) | A method the report names for this result, such as the LDL or eGFR equation. default null |
| `results[].assay` | string or null (optional) | An assay the report names for this result. default null |

## `get_body_composition` — Body composition scans

The athlete's body composition scans (DEXA) as recorded from their reports: total and regional fat, lean and bone mass, body fat percent, visceral fat, and whole-body bone density with the report's own percentiles. Values are as the report gave them, in the unit each field names. Read them back as measurements and nothing else: don't call a value healthy, ideal, high or low, don't suggest a body fat, weight or diet goal, and don't compare the athlete with anyone. Whole-body bone density is a measurement, not a diagnosis, and not a diagnostic bone density exam (those read the hip or spine and give T- or Z-scores); questions about it go to a clinician. Body Lab can't diagnose anything, and a scan never changes the training it prescribes. `comparableToPrevious` is false when the previous scan was done by another company or on another scanner model, which means a change may be the machine — it never means a change is real.

Scope: `body:read`. Read-only.

_No arguments._

## `record_body_composition` — Record a body composition scan

Records one body composition scan (DEXA) from a report the athlete gives you — structured data from their scanning service, a PDF, a photo, or values they read out — exactly as printed. Prefer structured data over a photo where you have both. Before calling, read every value back to the athlete with its unit and get their yes: this can't edit or delete anything afterwards, and nothing else can edit a scan either; only the athlete can remove one, in Body Lab on the web. Masses are kilograms, density g/cm², volume cm³: convert from pounds yourself and say so in the read-back. Call get_body_composition first to see what's already recorded; one call per scan. It's all or nothing — if anything is refused (a scan already recorded for that date and provider, a region Body Lab doesn't know, fat plus lean plus bone not adding up to the total) nothing is saved, and the error lists each problem. Body Lab can't diagnose anything, and a scan never changes the training it prescribes.

Scope: `body:write`. Writes: adds data, and can't change or delete it. The same call again adds again.

| Argument | Type | |
| --- | --- | --- |
| `localDate` | string | The day the scan was done on the athlete's calendar, YYYY-MM-DD — not the day the report was issued. |
| `scannedAt` | string (optional) | The instant the scan was acquired, ISO-8601 with offset, where the report gives a time. |
| `provider` | string (optional) | The company or facility as the report prints it, e.g. "BodySpec". |
| `scannerModel` | string (optional) | The scanner as the report prints it, e.g. "GE Lunar iDXA". Worth asking for: Body Lab only reads two scans as one line when the machine is the same. |
| `totalMassKg` | number (optional) | Total body mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. Recorded as a weigh-in for that day as well. min 20, max 400 |
| `fatMassKg` | number (optional) | Total fat mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 300 |
| `leanMassKg` | number (optional) | Total lean mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 300 |
| `boneMassKg` | number (optional) | Total bone mineral mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 20 |
| `tissueFatPct` | number (optional) | Body fat percent of tissue, which excludes bone — the figure most reports headline. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 80 |
| `regionFatPct` | number (optional) | Body fat percent including bone, where the report gives both. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 80 |
| `androidGynoidRatio` | number (optional) | Android/gynoid ratio, where the report gives it. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 10 |
| `vatMassKg` | number (optional) | Visceral fat (VAT) mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 20 |
| `vatVolumeCm3` | number (optional) | Visceral fat (VAT) volume, cm³. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 20000 |
| `bmdGCm2` | number (optional) | Whole-body bone mineral density, g/cm². As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. Never a T- or Z-score, and never a hip or spine value from a diagnostic exam. min 0.1, max 3 |
| `bmcG` | number (optional) | Whole-body bone mineral content, grams. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 10000 |
| `boneAreaCm2` | number (optional) | Whole-body bone area, cm². As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 5000 |
| `bmdAgeSexPercentile` | integer (optional) | The report's own percentile for bone density against people of the same age and sex, 1-99, only if the report prints one. min 1, max 99 |
| `bmdPeakSexPercentile` | integer (optional) | The report's own percentile for bone density against 30-year-olds of the same sex, 1-99, only if the report prints one. min 1, max 99 |
| `regions` | array (optional) | Each region the report breaks the body into, each once. Leave out entirely if the report gives only whole-body figures. at most 24 |
| `regions[].region` | string | Which part of the body this row is: left_arm, right_arm, left_leg, right_leg, trunk, android, gynoid. |
| `regions[].fatMassKg` | number (optional) | Fat mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 300 |
| `regions[].leanMassKg` | number (optional) | Lean mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 300 |
| `regions[].boneMassKg` | number (optional) | Bone mineral mass, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 20 |
| `regions[].totalMassKg` | number (optional) | Total mass of the region, kilograms. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 400 |
| `regions[].tissueFatPct` | number (optional) | Tissue fat percent (excludes bone). As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 80 |
| `regions[].regionFatPct` | number (optional) | Region fat percent (includes bone). As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 80 |
| `regions[].bmdGCm2` | number (optional) | Bone mineral density, g/cm². As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0.1, max 3 |
| `regions[].bmcG` | number (optional) | Bone mineral content, grams. As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 10000 |
| `regions[].boneAreaCm2` | number (optional) | Bone area, cm². As the report gives it, in the unit named here. Leave out rather than guess or convert from another quantity. min 0, max 5000 |

# Prompts

- **`todays-session`** — What should I do today?: Today's prescribed session, why Body Lab chose it, and the alternatives.
- **`weekly-review`** — Review my week: How the last week of training went against what was prescribed, and what changes next.
- **`record-a-lab-report`** — Record a lab report: Transcribe a blood test report into Body Lab, read back for my yes before anything is saved.
- **`record-a-body-scan`** — Record a body composition scan: Transcribe a body composition (DEXA) report into Body Lab, read back for my yes before anything is saved.

# Server instructions

```
Body Lab is the athlete's training app: it reads their training load and morning recovery signals and prescribes one session a day (endurance with heart-rate and power targets, or strength with sets, reps and weights), citing the metric behind each call.

- Body Lab's prescription and rationale are the source of truth for what the athlete should do; explain them rather than substituting your own plan, and say so when you disagree.
- Quantities are SI with the unit in the field name (durationS seconds, distanceM metres, weightKg, avgPowerW). Convert to the athlete's display units (`units`: metric or imperial) when talking to them.
- Dates like 2026-09-13 are days on the athlete's own calendar; instants are ISO-8601 UTC. get_today returns today's date and the athlete's time zone.
- Training load is on Body Lab's calibrated scale; CTL is fitness, ATL fatigue, form = CTL − ATL, ACWR the acute:chronic ratio.
- This is training guidance, not medical advice.
```
