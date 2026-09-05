# MathClans — Test V1.4.1

This is the next gameplay test build. It remains a local/simulated multiplayer prototype so the core game can be tuned before a real backend is added.

## V1.4.1 changes

- Clan war size changed to **1–10 players**.
- Team battle scoring uses **average performance**, not total player count. Larger teams receive only a small capped troop bonus.
- Historical **old Singapore street battle background** added, with dark overlays so characters, HP bars, damage and mental sums remain clear.
- Original browser-generated **soft ambient music** outside battle.
- Original browser-generated **battle music and sound effects** for marching, hits, shields, criticals, victory and defeat. No commercial game audio is used.
- Sound toggle added to the top bar; preference is remembered in the browser.
- Mathematical mastery levels are now **unlimited**. They no longer stop at Level 100.
- Mastery cards show titles and progress within the next mastery band.
- Battle bonuses use diminishing returns / soft ceilings, so unlimited levels never create unlimited combat power.
- Existing vintage Singapore campaign map and troop march remain.

## GitHub Pages

Upload/replace these files in the repository root:

- `index.html`
- `styles.css`
- `app.js`

No image or audio asset folder is required for this test build; the map and battle backdrop are embedded and sound is generated in-browser.

## Test flow

1. Open Train and answer worked-solution MCQs. Verify a skill can pass Level 100 eventually without showing MAX.
2. Open Clan, select **1 to 10** available members, then choose a rival.
3. Watch the troop formation march across Singapore.
4. On arrival, verify the old Singapore background appears behind a clear foreground battle.
5. Check team size (e.g. 7v7), Team Avg, HP, skill effects and mental sums.
6. Toggle the speaker button to test music/sound on and off.


## V1.4.1 hotfix
- 1-player deployment is explicitly enabled. The march button is always clickable; with zero selected it prompts for one player, and with 1-10 selected it opens target selection.
- Audio control now shows Sound ON / Sound OFF and includes a persistent volume slider.
- CSS/JS links include a version query to reduce stale GitHub Pages browser caching.
