# MathClans: Battle for Lion City — Version 1 Prototype

A browser-only prototype of the mathematics RPG / clan strategy game.

## What is included

- Stylised 2D Singapore strategy map
- Clan HQ identity and rival clans
- 10-member example clan roster
- Selection of 3–10 available players for war
- Four mathematical skills:
  - Algebra = attack
  - Geometry = defence
  - Trigonometry = precision / speed amplification
  - Statistics = tactical / critical effects
- Mathematical training using 4-option worked-solution MCQs
- Procedural question generation with several misconception patterns
- Training topics covering the initial requested Algebra, Geometry, Trigonometry and Statistics scope
- 90-second mental-sum Clan Clash
- Team mathematical stats modify combat without replacing speed/accuracy
- Clan rating rises or falls after battle; permanent mathematical mastery does not fall on defeat
- LocalStorage persistence in the browser
- Responsive desktop/mobile layout

## Run locally

Open `index.html` in a modern browser.

For best browser behaviour, serve it with a simple local/static web server rather than opening with `file://`.

## GitHub Pages

Upload the four files in this folder to a GitHub repository and enable GitHub Pages from the repository settings. No build process is required.

## Important V1 limitation

This is a gameplay prototype. Clan opponents are simulated in the browser. Real accounts, databases, real-time multiplayer matchmaking, server-authoritative battles and anti-cheat are deliberately not included yet.

## Suggested Version 2

1. Firebase/Supabase authentication and persistent player/clan database
2. Real online presence and war rally invitations
3. Server-based matchmaking for equal troop counts
4. WebSocket/Realtime synchronized mental-sum clash
5. Expanded non-repetition question DNA engine
6. Visual chart/diagram generators for Statistics and Geometry
7. Clan territory/influence and HQ districts on the Singapore map
8. Cosmetics, avatar builder, guardian evolution and seasons
9. Teacher/admin controls for syllabus and difficulty
10. Anti-cheat, battle logs and moderation
