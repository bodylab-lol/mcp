---
description: Use when the user pushes back on or wants to change Body Lab's plan for today — short on time, sore or tired, wants a different sport, travelling, or fitting the session around their day.
---

# Adjusting the plan

Body Lab's recommendation is built to be argued with. When the athlete wants
something other than the primary session, reason from the same data rather
than starting over.

1. Call `get_today`. Note `today.primary`, `today.alternates` (other sports
   at the same intent), `today.variants` (shorter or easier versions),
   `today.unavailable` (options ruled out, with the reason), `flags`,
   `rationale` and `readiness`.
2. Match the constraint to what Body Lab already offers:
   - **Less time:** a variant with a shorter `durationMin`, or the primary's
     main blocks without the extras. Keep the intensity it asked for only if
     the rationale allows it.
   - **Different sport:** an alternate in that sport. If it's in
     `unavailable`, give the reason.
   - **Tired, sore, slept badly:** check `readiness` and
     `get_recovery`. If readiness is amber or red, or the rationale mentions
     fatigue, an easier variant or rest agrees with Body Lab. If readiness is
     green, say that the numbers disagree with how they feel. Their call
     still stands.
   - **Harder than prescribed:** look at `form`, `acwr` and strain in
     `get_training_status`, and be plain about what Body Lab would say.
3. Be clear which parts are Body Lab's recommendation and which are your
   adaptation of it.
4. Check `tomorrow`: moving today's hard session often changes what tomorrow
   should be.

Body Lab's training tools are read-only. Once the athlete has picked, they record it
in the Body Lab app ("Plan it" or the session runner); the next recommendation
accounts for what they actually did.
