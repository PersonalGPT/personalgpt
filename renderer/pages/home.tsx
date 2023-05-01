import React from 'react';
import Head from 'next/head';

export default function Home() {
  const [conversation, setConversation] = React.useState([]);
  const [prompt, setPrompt] = React.useState("");
  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const [streamData, setStreamData] = React.useState("");
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (streamData.length > 0) {
      const replaced = conversation;

      replaced[replaced.length - 1] = {
        type: "response",
        message: streamData,
      };
      setConversation(replaced);
    }
  }, [streamData]);

  const parseDataStream = (data) => {
    if (!data) return;

    const lines = data.split("\n\n")
      .filter((line) => line.length > 0 && !line.includes("[DONE]"));

    for (const line of lines) {
      const clean = line.replace("data: ", "");
      const json = JSON.parse(clean);

      const token = json.choices[0].delta.content;

      if (token) {
        setStreamData(prevData => prevData + token);
      };
    }
  };

  const sendRequest = async () => {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    const reader = completion.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const res = await reader?.read();
      if (res?.done) {
        setStreamData("");
        break;
      }
      parseDataStream(res.value);
    }

    setInputDisabled(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputDisabled(true);
    setConversation(conversation.concat([
      { type: "user", message: prompt },
      { type: "response", message: "" }
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
                  ${convo.type === "response" ? "bg-green-500" : "bg-gray-500"}
                `} />
                <p className="place-self-center whitespace-pre-wrap">
                  {convo.message}
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
