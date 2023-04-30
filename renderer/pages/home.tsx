import React from 'react';
import Head from 'next/head';

const conversation = [
  { type: "request", message: "User prompt 1" },
  { type: "response", message: "AI response 1" },
  {
    type: "request",
    message: `
      Another user prompt, but longer this time. Lorem ipsum dolor sit amet
      consectetur adipisicing elit. Corrupti dolorem facilis eos mollitia sint
      sequi nulla iusto quidem saepe voluptas accusantium reiciendis esse delectus
      molestiae pariatur minima, quos cum dolor?
    `
  },
  {
    type: "response",
    message: [
      `Another AI response, but longer too. Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Blanditiis alias similique maiores minima
      quam distinctio, dolor, in vel dolorem voluptates iste non ab accusantium
      vitae eos expedita obcaecati deleniti ipsam!`,
      <br/>, <br/>,
      `Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
      repellendus tenetur molestiae error obcaecati odit vero, omnis ut
      perspiciatis corporis magnam quae impedit iste vel provident, fugit rerum
      dignissimos commodi.`
    ]
  },
];

export default function Home() {
  const [prompt, setPrompt] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`GPT Prompt: ${prompt}`);
    setPrompt("");
  };

  return (
    <React.Fragment>
      <Head>
        <title>Home - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen grid">
        <div className="flex flex-col gap-8 py-12 px-24">
          <div className="grow overflow-y-auto">
            {conversation.map((convo, index) => (
              <div key={index} className="flex gap-6 px-6 py-8 even:bg-gray-800">
                <div className={`
                  w-8 h-8 rounded shrink-0
                  ${convo.type === "response" ? "bg-green-500" : "bg-gray-500"}
                `} />
                <p className="place-self-center">{convo.message}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={prompt}
              placeholder="Enter your message here..."
              onChange={e => setPrompt(e.target.value)}
              className="
                rounded-md p-3 bg-gray-700 text-white w-full
                focus-visible:outline-gray-500 focus-visible:outline-none
                focus-visible:outline-offset-0
              "
            />
          </form>
        </div>
      </main>
    </React.Fragment>
  );
}
