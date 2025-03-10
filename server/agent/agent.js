import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';

const model = new ChatAnthropic({
  model: 'claude-3-5-sonnet-latest',
});

const tool = new tool(
  async ({ query }) => {
    console.log('query ', query);
    return 'The weather in Tokyo is sunny';
  },
  {
    name: 'weatherTool',
    description: 'Get the weather in a given location',
    schema: z.object({
      query: z.string().describe('To query to use in search'),
    }),
  }
);

const checkpointSaver = new MemorySaver();

const agent = createReactAgent({
  llm: model,
  tools: [weatherTool],
  checkpointSaver,
});

const result = await agent.invoke(
  {
    messages: [
      {
        role: 'user',
        content: 'What is the weather in Tokyo?',
      },
    ],
  },
  { configurable: { thread_id: 42 } }
);

const followup = await agent.invoke(
  {
    messages: [
      {
        role: 'user',
        content: 'What city is that for?',
      },
    ],
  },
  { configurable: { thread_id: 42 } }
);

console.log('result ', result.messages.at(-1)?.content);

console.log('followup ', followup.messages.at(-1)?.content);
