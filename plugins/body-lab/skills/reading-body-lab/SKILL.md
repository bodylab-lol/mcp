---
description: Use when answering questions about the user's training, recovery, activities, strength or fitness from Body Lab — which Body Lab tool to call, and how to read and present its numbers.
---

# Reading Body Lab

Body Lab prescribes one session a day from the athlete's training load and
morning recovery signals, and cites the metric behind each call. Its tools
are read-only, except that, where the athlete allowed it, an assistant can add
lab results (`record_lab_results`); nothing can be changed or deleted.

## Which tool

| The question | Call |
| --- | --- |
| What should I do today? Should I rest? Why that session? | `get_today` |
| How's my training going? Am I overdoing it? Compare weeks | `get_training_status` (`days` 28–365) |
| What pace is hard for me? My critical speed | `get_training_status`'s `criticalSpeed` |
| How long until my race? Why is today easier before it? | `get_today`'s `nearestEvent` (also in `get_training_status`) |
| What did I do? How did a particular session go? | `list_activities`, then `get_activity` with its `id` |
| Sleep, HRV, resting heart rate, "am I recovered" | `get_recovery` (and `get_today`'s `readiness`) |
| How much have I moved outside training? Steps lately | `get_daily_steps` |
| How has my weight / blood pressure / resting HR moved? One series against another, over a chosen range | `get_measurements` |
| Anything I should know today? Is my sleep OK? | `get_today`'s `notes` |
| Does drinking / late coffee / stress show in my readings? What have my daily updates found? | `get_patterns` (needs the athlete to have allowed daily updates) |
| "I had three beers last night", "feeling wrecked today" | `record_daily_update`, after checking with the athlete what to record |
| Lifting: what weights next, recent sessions, estimated maxes | `get_strength` |
| Blood tests: how's my ferritin, what did my last panel show | `get_lab_results` (needs the athlete to have allowed lab results) |
| Record this lab report | `record_lab_results`, after reading every value back to the athlete and getting their yes |
| Zones, FTP, max/resting HR, test results, power curve | `get_profile` |
| Which exercise is which | `find_exercises` |
| Where to ride or run today | `suggest_routes` |

Call `get_today` first when the date, time zone or display units matter: it
returns the athlete's local `date`, `timezone` and `units`.

## Today's notes

`get_today`'s `notes` are what Body Lab's timeline calls out, exactly as the
athlete sees them in the app, less any they've hidden. Most days there are
none.

- Pass a note on in its own words. Its `text` states the numbers and, for a
  guideline, who the guideline is for.
- `kind` says what to do with it:
  - `insight`: something the athlete can act on.
  - `observation`: today's plan already accounts for it, so don't tell them
    to act on it a second time.
  - `milestone`: a new best or a first.
  - `gap`: missing data that makes today's plan generic.
- Congratulate only where `improvement` is true.
- Don't name a condition, diagnose, or advise beyond the note. When you
  discuss a sleep note, include its `detail`: that's where the one sentence
  about raising it with a doctor lives.

## Daily updates and patterns

`get_today`'s `dailyUpdate` only says whether today's check-in is waiting;
the answers themselves need `checkins:read`.

- A `get_patterns` card compares one person's nights. Pass on its `text` and
  `cantTell` together, as written. Never say a habit caused a reading, and
  don't stretch a card into advice it doesn't give.
- `state` decides what can be said: `collecting` and `unclear` mean there is
  nothing to conclude yet; `no_difference` is a real answer, not a failure.
- Record only what the athlete says, after checking with them. Never infer
  drinks, stress or anything else from their readings.

## Reading the numbers

- Fields carry their unit: `durationS` seconds, `distanceM` metres,
  `elevationGainM`, `weightKg`, `avgPowerW`, heart rates in bpm. Convert to
  the athlete's `units` (`metric` or `imperial`) when you talk to them. Say
  "45 minutes", not "2700 seconds".
- Dates like `2026-09-13` are days on the athlete's own calendar. Instants
  are UTC. Show times in their `timezone`.
- Training load is on Body Lab's own calibrated scale. It's comparable across
  the athlete's activities, not with other apps' numbers.
- `ctl` is fitness (42-day weighted load), `atl` fatigue (7-day), `form` =
  ctl − atl, `acwr` the acute:chronic ratio (null until there's enough
  history). Readiness `band` is green, amber, red or unknown.
- `excludedActivities` above zero means some sessions had no heart rate,
  effort rating or duration to score. The metrics read low; say so.
- A reading, target or anchor that's `null` is unknown, not zero.
- In `get_recovery`, `sleepMinutes` is minutes asleep on the night that ended
  that morning, awake time excluded; say it as hours and minutes. It's a
  separate reading from `sleepScore`, the device's 0–100 score. Readiness
  uses the score, not the minutes. One night can have either or both.
- In `get_daily_steps`, each day is one device's count, never several added
  together, and a day without a count is absent, not zero. A `partial` day
  (today) is a count so far: say "so far", and don't compare it with whole
  days. Quote `mean7` with `mean7Days`, the number of days it covers. A
  `whoop` count is a WHOOP cycle, which runs from one sleep to the next, dated
  by the morning that sleep ended. `seriesSource` is the device every day's
  count comes from: the athlete's choice (`chosenSource`), or while they
  haven't made one, the one with the most counts. Steps include recorded
  sessions, and nothing in the prescription reads them, so don't explain a
  session by them.
- In `get_measurements`, ask only for the series the question needs:
  series × days is capped at 1,500, and over that it refuses with what would
  fit. Each series is newest first, and a day without a value is absent. A
  series that wasn't asked for is `null`. A dated value (weight, VO2max, FTP,
  threshold HR or speed) marked `carriedForward` was measured before the
  range and is the value in effect when the range begins; say when it was
  measured. Blood pressure comes as sittings: the average of readings taken
  within 15 minutes, with every reading kept. Read blood pressure back as
  numbers only. Never call one high, normal or healthy, never name a
  category or threshold, and send questions about it to a clinician.
- `nearestEvent` is the athlete's nearest A event: its `name`, `daysUntil`
  (negative once it has passed) and `phase`: `build`, `taper`, `event_day`
  or `recovery`. In `taper` and `recovery`, `totalDays` is the window's
  length. Lighter sessions in those phases are deliberate. Explain them from
  the phase and the `rationale`, not as a sign the athlete is falling behind.
- `criticalSpeed` (in `get_training_status`) is running only. Speeds are
  metres per second: say them as pace in the athlete's `units`, always with
  the ±, which comes from GPS error. Use `fit.today` when it's there;
  `fit.seaLevel` is faster than the athlete can run at altitude, so say
  which it is. A change under 5% between two readings is noise. When `fit`
  is null, `refusal.reason` says why: pass that on rather than estimating a
  pace yourself. `deviceThreshold` is a watch's lactate-threshold estimate,
  shown for comparison: never offer it as a target or as their critical
  speed.
- In `get_activity`, a run's `speedBests` are its fastest averages over each
  duration, `raw` as recorded and `gap` grade-adjusted. Say them as pace.
- When more than one source recorded the same session, `list_activities`
  shows it once, and `get_activity` lists the other copies in
  `alsoRecordedBy`. An activity whose `duplicateOf` is set is one of those
  copies: the session it points to is the one that counts. Don't present a
  copy as a separate workout.

## Presenting it

- Lead with the answer, then the numbers that support it.
- Use Body Lab's `rationale` for the "why". Don't invent reasons it didn't
  give. If you disagree with its call, say it's your view and why.
- This is training guidance, not medical advice. For pain, illness or
  anything that sounds like injury, suggest a professional.
