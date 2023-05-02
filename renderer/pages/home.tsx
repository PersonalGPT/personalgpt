import React from 'react';
import Head from 'next/head';

enum ChatCompletionRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

interface ChatCompletionMessage {
  role: ChatCompletionRole;
  content: string;
  name?: string;
}

export default function Home() {
  const [conversation, setConversation] = React.useState<ChatCompletionMessage[]>([]);
  const [prompt, setPrompt] = React.useState("");
  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const [streamData, setStreamData] = React.useState("");
  const scrollRef = React.useRef(null);

  // Whenever streamData is updated, the AI conversation message is also updated
  // This will give us the trailing text/typing effect
  React.useEffect(() => {
    if (streamData.length > 0) {
      const replaced = conversation;

      replaced[replaced.length - 1] = {
        role: ChatCompletionRole.ASSISTANT,
        content: streamData,
      };
      setConversation(replaced);
    }
  }, [streamData]);

  const parseDataStream = (data) => {
    if (!data) return;

    // Split data chunks delimited by \n\n
    const lines = data.split("\n\n")
      .filter((line) => line.length > 0 && !line.includes("[DONE]"));

    // Convert chunks to JSON and extract text content
    for (const line of lines) {
      const clean = line.replace("data: ", "");
      const json = JSON.parse(clean);

      const token = json.choices[0].delta.content;

      if (token) {
        setStreamData(prevData => prevData + token);
      };
    }
  };

  const processDataStream = async (stream: Response) => {
    // Convert text stream to UTF-8, then lock it to reader
    const reader = stream.body.pipeThrough(new TextDecoderStream()).getReader();

    // Read stream chunks sequentially, then parse each chunk to readable text
    while (true) {
      const res = await reader?.read();
      if (res?.done) {
        setStreamData("");
        break;
      }
      parseDataStream(res.value);
    }
  };

  const sendRequest = async () => {
    // Fetch chat completion data stream
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...conversation],
        stream: true,
      }),
    });

    await processDataStream(completion);
    setInputDisabled(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputDisabled(true);
    setConversation(conversation.concat([
      { role: ChatCompletionRole.USER, content: prompt },
      { role: ChatCompletionRole.ASSISTANT, content: "" }
    ]));
  };

  React.useEffect(() => {
    if (prompt.length > 0) {
      sendRequest();
      setPrompt("");
    }
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <React.Fragment>
      <Head>
        <title>Home - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen grid overflow-x-hidden">
        <div className="flex flex-col gap-8 pt-12 px-24 max-w-7xl mx-auto w-full relative">
          <div className="grow overflow-y-auto">
            {conversation.map((convo, index) => (
              <div key={index} className="flex gap-6 px-6 py-8 even:bg-gray-800">
                <div className={`
                  w-8 h-8 rounded shrink-0
                  ${convo.role === ChatCompletionRole.ASSISTANT ? "bg-green-500" : "bg-gray-500"}
                `} />
                <p className="place-self-center whitespace-pre-wrap">
                  {convo.content}
                </p>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 h-28 bg-gradient-to-t from-gray-900 to-gray-900/90"
          >
            <input
              type="text"
              value={prompt}
              placeholder="Enter your message here..."
              onChange={e => setPrompt(e.target.value)}
              disabled={isInputDisabled}
              className="
                rounded-md p-3 bg-gray-700 text-white w-full
                focus-visible:outline-gray-500 focus-visible:outline-none
                focus-visible:outline-offset-0 disabled:text-gray-500
              "
            />
          </form>
        </div>
      </main>
    </React.Fragment>
  );
}
