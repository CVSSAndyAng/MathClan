MathClans V1.5.4 Test

Hotfix: pressing Enter/Return once now submits a battle answer. The duplicate keydown handler was removed so iPad Safari can commit the input value and submit the form in one action.

# MathClans: Battle for Lion City — Test V1.5

## What changed
- Added simulated live clan presence: Members / Online / War Ready / Deployed.
- Added a two-step War Council with 5 formations: Balanced, Assault, Fortress, Precision and Tactical.
- Formations give small RPG modifiers while live mental-sum performance remains the main factor.
- Added a Hero screen showing unlimited mastery, subskills, soft-ceiling battle effects and achievement relics.
- Selected warriors change to DEPLOYED during battle and return to WAR READY afterward.
- 1–10 player battles remain supported.
- Non-battle and battle MP3 tracks remain included.

This is still a simulated multiplayer test build. Real login accounts, realtime online presence and real player-vs-player answers belong to the backend multiplayer version.


## V1.5.1 amendments
- Strike can be submitted with the Enter/Return key as well as the Strike button.
- The answer field uses the iPad keyboard Go/Return action where supported.
- Added iPad portrait and landscape responsive layouts, larger touch targets, safe-area handling, and 16px+ inputs to prevent Safari auto-zoom.
- Navigation, roster selection, training choices and battle controls are touch-optimised.


## V1.5.4 — Recent Mastery Confidence

This build adds a rolling confidence system to each of the four mathematical abilities. Ability levels remain permanent and unlimited, but recent performance can move Confidence between 30% and 100%.

- First mistake: no confidence deduction.
- 2nd consecutive mistake: -1 confidence.
- 3rd consecutive mistake: -2 confidence.
- 4th and later consecutive mistakes: -3 confidence, with an extra small penalty when 5 or more of the latest 7 attempts are wrong.
- Correct answer: +1 confidence, or +2 while recovering from low confidence.
- Repeated errors activate Remedial Training, which more often serves a simpler core-method question until recent performance recovers.
- Permanent Algebra / Geometry / Trigonometry / Statistics levels never fall from mistakes.
- Effective battle bonus uses the permanent level plus a modest confidence factor, so current understanding matters without erasing long-term learning.
