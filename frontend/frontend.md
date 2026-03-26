# File Tree: frontend

**Generated:** 1/3/2026, 6:01:26 PM
**Root Path:** `d:\Zhilingg-Donghua\frontend`

```
├── 📁 docs
│   ├── 📝 POST_LOADING_LOGIC.md
│   └── 📝 story_architecture.md
├── 📁 prompts
│   ├── 📁 ai
│   │   └── 📝 story.md
│   └── 📁 human
│       ├── 🌐 rightsidebar.html
│       └── 📝 story.md
├── 📁 public
│   ├── 📁 sounds
│   │   ├── 🎵 DuckQuack.mp3
│   │   ├── 🎵 keystroke1.mp3
│   │   ├── 🎵 mouse-click.mp3
│   │   └── 🎵 notification.mp3
│   ├── 🖼️ 1.png
│   ├── 🖼️ 3.png
│   ├── 🖼️ 4.png
│   ├── 🖼️ avatar.png
│   └── 🖼️ logo.png
├── 📁 src
│   ├── 📁 apis
│   │   ├── 📄 post.api.js
│   │   ├── 📄 stream.api.js
│   │   └── 📄 user.api.js
│   ├── 📁 assets
│   │   ├── 🖼️ create.svg
│   │   ├── 🖼️ explore.svg
│   │   ├── 🖼️ heart.svg
│   │   ├── 🖼️ home.svg
│   │   ├── 📄 index.js
│   │   ├── 🖼️ messenger.svg
│   │   ├── 🖼️ post.svg
│   │   ├── 🖼️ react.svg
│   │   ├── 🖼️ reels.svg
│   │   └── 🖼️ search.svg
│   ├── 📁 components
│   │   ├── 📁 chats
│   │   │   ├── 📁 lists
│   │   │   │   ├── 📄 ChatsList.jsx
│   │   │   │   └── 📄 ContactList.jsx
│   │   │   ├── 📁 status
│   │   │   │   ├── 📄 ActiveTabSwitch.jsx
│   │   │   │   ├── 📄 NoChatHistoryPlaceholder.jsx
│   │   │   │   ├── 📄 NoChatsFound.jsx
│   │   │   │   └── 📄 NoConversationPlaceholder.jsx
│   │   │   ├── 📄 ChatContainer.jsx
│   │   │   ├── 📄 ChatHeader.jsx
│   │   │   └── 📄 MessageInput.jsx
│   │   ├── 📁 loads
│   │   │   ├── 📄 MessagesLoadingSkeleton.jsx
│   │   │   ├── 📄 PageLoader.jsx
│   │   │   └── 📄 UsersLoadingSkeleton.jsx
│   │   ├── 📁 me
│   │   │   ├── 📄 LogoutButton.jsx
│   │   │   └── 📄 ProfileHeader.jsx
│   │   ├── 📁 modals
│   │   │   ├── 📄 IncomingCallModal.jsx
│   │   │   ├── 📄 LogoutModal.jsx
│   │   │   └── 📄 WaitingCallModal.jsx
│   │   ├── 📁 ui
│   │   │   ├── 📄 avatar.jsx
│   │   │   ├── 📄 badge.jsx
│   │   │   ├── 📄 button.jsx
│   │   │   ├── 📄 dialog.jsx
│   │   │   ├── 📄 input.jsx
│   │   │   ├── 📄 label.jsx
│   │   │   ├── 📄 popover.jsx
│   │   │   ├── 📄 select.jsx
│   │   │   ├── 📄 sonner.jsx
│   │   │   └── 📄 textarea.jsx
│   │   ├── 📄 BackgroundEffect.jsx
│   │   ├── 📄 BorderAnimatedContainer.jsx
│   │   ├── 📄 PrivateRouter.jsx
│   │   └── 📄 PublicRouter.jsx
│   ├── 📁 contexts
│   │   └── 📄 StreamVideoContext.jsx
│   ├── 📁 hooks
│   │   ├── 📁 posts
│   │   │   └── 📄 usePost.js
│   │   ├── 📁 sounds
│   │   │   ├── 📄 useKeybroadSound.js
│   │   │   └── 📄 useSound.js
│   │   ├── 📁 stories
│   │   ├── 📁 streams
│   │   │   ├── 📄 useGetStreamToken.js
│   │   │   ├── 📄 useIncomingCall.js
│   │   │   └── 📄 useStreamVideo.js
│   │   └── 📁 users
│   │       └── 📄 useUser.js
│   ├── 📁 layouts
│   │   ├── 📄 LayoutCover.jsx
│   │   ├── 📄 RootLayout.jsx
│   │   ├── 📄 SocialMediaLayout.jsx
│   │   └── 📄 StreamVideoLayout.jsx
│   ├── 📁 lib
│   │   ├── 📄 axios.js
│   │   ├── 📄 dayjs.js
│   │   └── 📄 utils.js
│   ├── 📁 pages
│   │   ├── 📁 auth
│   │   │   ├── 📄 LoginPage.jsx
│   │   │   └── 📄 SignUpPage.jsx
│   │   ├── 📁 chats
│   │   │   └── 📄 ChatPage.jsx
│   │   ├── 📁 e-commerce
│   │   ├── 📁 social-media
│   │   │   ├── 📁 comment
│   │   │   │   ├── 📄 Comment.jsx
│   │   │   │   └── 📄 CommentDialog.jsx
│   │   │   ├── 📁 components
│   │   │   │   ├── 📄 LeftSidebar.jsx
│   │   │   │   └── 📄 RightSidebar.jsx
│   │   │   ├── 📁 post
│   │   │   │   ├── 📄 CreatePost.jsx
│   │   │   │   ├── 📄 Post.jsx
│   │   │   │   └── 📄 Posts.jsx
│   │   │   ├── 📁 profile
│   │   │   │   ├── 📄 EditProfile.jsx
│   │   │   │   └── 📄 Profile.jsx
│   │   │   ├── 📁 story
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 StoriesHover
│   │   │   │   │   │   ├── 📄 StoriesHover.jsx
│   │   │   │   │   │   └── 📄 utils.js
│   │   │   │   │   ├── 📁 StoryButton
│   │   │   │   │   │   ├── 📄 index.jsx
│   │   │   │   │   │   └── 📄 utils.js
│   │   │   │   │   ├── 📁 StoryImg
│   │   │   │   │   │   ├── 📄 index.jsx
│   │   │   │   │   │   └── 📄 utils.js
│   │   │   │   │   ├── 📁 StoryPortal
│   │   │   │   │   │   ├── 📄 StoryPotal.jsx
│   │   │   │   │   │   └── 📄 utils.js
│   │   │   │   │   ├── 📄 ConditionalNode.jsx
│   │   │   │   │   ├── 📄 PostIcon.jsx
│   │   │   │   │   ├── 📄 Stories.jsx
│   │   │   │   │   └── 📄 StoryBubble.jsx
│   │   │   │   ├── 📁 contexts
│   │   │   │   │   ├── 📄 StoriesContext.js
│   │   │   │   │   └── 📄 context.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useStoryPause.js
│   │   │   │   ├── 📁 reducers
│   │   │   │   │   ├── 📁 storiesReducer
│   │   │   │   │   │   ├── 📄 getInitialValue.js
│   │   │   │   │   │   └── 📄 index.js
│   │   │   │   │   └── 📄 types.enums.js
│   │   │   │   └── 📁 services
│   │   │   │       ├── 📄 setNextPrevStory.js
│   │   │   │       ├── 📄 startStoryTransition.js
│   │   │   │       ├── 📄 toggleModal.js
│   │   │   │       └── 📄 toggleOverflowHidden.js
│   │   │   └── 📄 page.jsx
│   │   └── 📁 streams
│   │       └── 📁 [id]
│   │           └── 📄 CallPage.jsx
│   ├── 📁 redux
│   │   ├── 📄 authSlice.js
│   │   ├── 📄 postSlice.js
│   │   └── 📄 store.js
│   ├── 📁 store
│   │   ├── 📄 auth.store.js
│   │   ├── 📄 chat.store.js
│   │   └── 📄 videoCall.store.js
│   ├── 📁 types
│   │   ├── 📄 message.type.ts
│   │   └── 📄 user.type.ts
│   ├── 📁 utils
│   │   ├── 📄 Timer.js
│   │   ├── 📄 readFileAsDataUrl.js
│   │   └── 📄 timing.js
│   ├── 📄 App.jsx
│   ├── 🎨 index.css
│   ├── 📄 main.jsx
│   └── 📄 routes.jsx
├── ⚙️ .gitignore
├── ⚙️ components.json
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ jsconfig.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
└── 📄 vite.config.js
```

---

_Generated by FileTree Pro Extension_
