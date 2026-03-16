# Pretty Chat

A React component that renders text with a typewriter effect and customizable edge color fade effect. It is perfect for streaming AI chatbot text.

## Installation

Pretty-chat is not published to npm. Install it from the package source by building a tgz and adding it to your project.

### 1. Build the package (from the pretty-chat repo)

In the pretty-chat package directory:

```bash
npm install
npm run build
npm pack
```

(`npm run prep` runs build plus copying README/LICENSE into `dist`; use it if you prefer.) This creates `pretty-chat-1.0.0.tgz` in the pretty-chat folder.

### 2. Install into your project

Copy `pretty-chat-1.0.0.tgz` into your project folder (or keep it elsewhere and use the path below). Add the dependency to your project's `package.json`:

```json
"dependencies": {
  "pretty-chat": "file:pretty-chat-1.0.0.tgz"
}
```

If the tgz lives outside your project (e.g. a sibling folder), use a path like `file:../pretty-chat/pretty-chat-1.0.0.tgz`.

Then install:

```bash
npm install
```

## Getting started

First, use the useTypewriter hook to get access to some useful functions and variables for controlling the typewriter feed.

```typescript
import * as PrettyChat from 'pretty-chat';

export const Demo = () => {
    const {
        // helper functions
        feedText,
        endTextFeed,
        resetTypewriter,

        // variables 
        cachedText,
        incrementor,
        markdownSegments,
    } = PrettyChat.useTypewriter();
}
```

Use the 3 helper functions to feed chunks of streaming text to your typewriter. 

```typescript
 const handleSendMessage = () => {
        // handle an interrupt by closing the current stream before sending new message
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        resetTypewriter(); // Prepare the typewriter for next message
        ... implement stream event handlers below ...
 }
```

```typescript
 eventSourceRef.current.onmessage = (event) => {
    const chunk = event.data;
    feedText(chunk); // Feed data to your typewriter as it arrives
    dispatch(addBotMessageToChatList(chunk));
};
...
```

```typescript
eventSourceRef.current.addEventListener('end', () => {
    endTextFeed(); // Inform the typewriter it should expect to stop processing text soon
    dispatch(markEndOfBotResponse());
    if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
    }
});
```

Finally, implement the Typewriter component in your JSX. 
Customize it by passing in edgeColor, restColor, and duration.

```typescript
<div className={styles.chatBox}>
    {chatList.map((message, index) => {
        // user entries
        if (message.type === "user") {
            return (
                <div key={`${index}`} className={styles.right}>
                    {message.text}
                </div>
            );
        }

        // bot entries
        return (
            <div key={`${index}`} className={styles.left}>
                <PrettyChat.Typewriter
                    // Pass in raw text from your stream, or the complete text if not currently streaming
                    rawText={Array.isArray(chatList[index].text) ? chatList[index].text.join("") : cachedText}

                    // Set isTyping to true for the one message in the ChatList that is actively typing
                    isTyping={ isLast(index) && !isFirst(index)}

                    // Pass the incrementor through so the component can keep rendering characters from your stream
                    incrementor={incrementor} 

                    // Pass in markdownSegments so the Typewriter can render them appropriately
                    markdownSegments={markdownSegments}
            
                    // Define an edge color which will fade to rest color
                    edgeColor="#ff03ee"

                    // Define a rest color for the text to settle into
                    restColor="black"

                    // Define a duration for your edge fade
                    edgeDuration={.5}
                />
            </div>
        );
    })}
 </div>
```

## Modifying PrettyChat source code

You are welcome to modify PrettyChat. 
This may be required if there is a maintenance issue, or you require added functionality or more specific styling for your application.

After modifying the source code, you can run `npm run prep` to rebuild the package.
 Then run `npm pack` to generate a new tgz file which you can install into your main application. 