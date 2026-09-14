---
description: Use when answering questions about the user's training, recovery, activities, strength or fitness from Body Lab — which Body Lab tool to call, and how to read and present its numbers.
---

# Reading Body Lab

Body Lab prescribes one session a day from the athlete's training load and
morning recovery signals, and cites the metric behind each call. Its tools
are read-only.

## Which tool

| The question | Call |
| --- | --- |
| What should I do today? Should I rest? Why that session? | `get_today` |
| How's my training going? Am I overdoing it? Compare weeks | `get_training_status` (`days` 28–365) |
| What did I do? How did a particular session go? | `list_activities`, then `get_activity` with its `id` |
| Sleep, HRV, resting heart rate, "am I recovered" | `get_recovery` (and `get_today`'s `readiness`) |
| Lifting: what weights next, recent sessions, estimated maxes | `get_strength` |
| Zones, FTP, max/resting HR, test results, power curve | `get_profile` |
| Which exercise is which | `find_exercises` |
| Where to ride or run today | `suggest_routes` |

Call `get_today` first when the date, time zone or display units matter: it
returns the athlete's local `date`, `timezone` and `units`.

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

## Presenting it

- Lead with the answer, then the numbers that support it.
- Use Body Lab's `rationale` for the "why". Don't invent reasons it didn't
  give. If you disagree with its call, say it's your view and why.
- This is training guidance, not medical advice. For pain, illness or
  anything that sounds like injury, suggest a professional.
