# MathClans V1.4.3 Test

Hotfixes:

- Fixed navigation/buttons becoming unresponsive after the first click.
- Fixed WebAudio recursion that prevented music from starting and interrupted click handlers.
- Sound ON/OFF and volume slider remain available.
- Battle roster and test rule are now consistently 1–10 players.
- 1-player deployment is supported.

Replace `index.html`, `styles.css`, and `app.js` on GitHub Pages. Then hard refresh with Ctrl+F5.


## V1.4.3 hotfix
- Audio is isolated from navigation; browser audio errors can no longer block buttons.
- Removed the document-wide audio pointer listener.
- Volume changes no longer turn sound on automatically.
- Battle deployment remains 1–10 players.
