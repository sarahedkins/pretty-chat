# Pretty Chat

A React component that renders text with a typewriter effect and customizable edge color fade effect. It is perfect for streaming AI chatbot text.

## Installation

Download the pretty-chat tgz file. 

Put the pretty-chat tgz file into your project folder.
Add a line to your project's dependencies to include the file.

```json
"dependencies": {
  "pretty-chat": "file:pretty-chat-1.0.0.tgz",
}
```

Then install the package:
`npm install pretty-chat`

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
        // hand an interupt by closing the current stream before sending new message
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