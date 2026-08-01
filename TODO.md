# TalkHub Frontend API Fix - Task List

- [x] Create `client/src/shared/api.js` - safe JSON parsing helper
- [x] Update `client/src/shared/basUrl.js` - only trust absolute REACT_APP_API_URL
- [x] Update `client/src/Containers/Room/Helpers/server_url.js` - add REACT_APP_BACKEND_URL support
- [x] Update `client/src/Containers/Room/Video.js` - use shared server_url
- [x] Update `client/src/Messenger/MessageList/index.js` - socket to server_url + safe parse
- [x] Update `client/src/Containers/Signup/Signup.js` - response.ok check + safe parse
- [x] Update `client/src/redux/ActionCreators.js` - safe parse login + DOM guard
- [x] Update `client/src/App.js` - response.ok check + safe parse
- [x] Update `client/src/Messenger/ConversationList/index.js` - safe parse + catch
- [x] Create `client/.env.example`
- [x] Update `client/.gitignore` - ignore .env files
- [x] Verify build (production build succeeded; bundle contains Render backend URLs)

